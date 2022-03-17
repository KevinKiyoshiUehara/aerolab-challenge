import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/app.service';

//models
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import { SortingCategories } from '../models/sorting-categories.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products-component',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent implements OnInit {
  paginateData: Product[] = [];
  page = 1;
  pageSize = 16;
  items = [];
  collectionSize: number;
  userHasEnoughPoints = true;
  user: User;
  filterByCategory = "All"
  categories: any[];
  selectedCategory = 'All Products';
  setSelectedButtonBackground1: boolean;
  setSelectedButtonBackground2: boolean;
  sortCategory: string = '';
  sortingCategory = SortingCategories;
  showToast = true;
  itemToRedeem = 
  {
    'productId': ''
  }
  redeemable = product => product.cost <= this.user.points;
  unredeemable = product => product.cost >= this.user.points;

  constructor(
    private service : AppService,
    private toastr: ToastrService
  ) {
    this.getUser();
  }

  ngOnInit(): void {
    this.service.user.subscribe( user => {
        this.user = user;
        this.selectedCategory = 'All Products';
        this.setSelectedButtonBackground1 = false;
        this.setSelectedButtonBackground2 = false;
        this.getProducts();
      });
  }

  getData(){
    this.paginateData =  this.items
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    this.collectionSize = this.items.length;
  }

  getUser() {
    this.service.getUser().subscribe((data: User) => {
    this.user = data;
    this.service.user.emit(this.user);
    this.getProducts();
    })
  }

  
  getProducts() {
    this.service.getProducts().subscribe((data: Product[]) => {
      this.items = data;
      console.log(data);
      this.setRedeemStatus();
      this.setDropdownCategories();
      this.onSortCategoryChange(this.sortCategory);
      this.getData();
    })
  }

  onCategoryFilter(category) {
    this.setSelectedButtonBackground1 = false;
    this.setSelectedButtonBackground2 = false;
    this.selectedCategory = category
    if(this.selectedCategory !== 'All Products') {
      const selectedCategory = product =>  product.category === category;
      console.log(category)
      this.service.getProducts().subscribe((data: Product[]) => {
      this.items = data.filter(selectedCategory)
      this.setRedeemStatus();
      this.getData();
    });
    } else {
      this.getProducts();
    }
    
  }

  setDropdownCategories() {
    const filteredCategories = this.items.map(product => product.category);
      this.categories = filteredCategories.filter((category, position, filteredCategories) => {
        return position === filteredCategories.indexOf(category);
      }).sort();
      this.categories.unshift('All Products')
  }

  setRedeemStatus() {
    const products = this.items.filter(this.redeemable);
      products.push(...this.items.filter(this.unredeemable));
      this.items = products;
      this.items = this.items.map(product => ({
        ...product, redeemable : (product.cost <= this.user.points) ? true : false
      }))
  }

  onSortCategoryChange(sortCategory) {
    if (sortCategory === SortingCategories.LowestPrice) {
      this.sortCategory = SortingCategories.LowestPrice;
      this.setSelectedButtonBackground1 = true;
      this.setSelectedButtonBackground2 = false;
      this.items.sort((a,b) =>  a.cost - b.cost)
      this.page = 1;
      this.getData();
    } else if (sortCategory === SortingCategories.HighestPrice) {
      this.sortCategory = SortingCategories.HighestPrice;
      this.setSelectedButtonBackground1 = false;
      this.setSelectedButtonBackground2 = true;
      const redeemable = this.items.filter(this.redeemable);
      const unredeemable = this.items.filter(this.unredeemable);
      redeemable.sort((a,b) =>  b.cost - a.cost);
      unredeemable.sort((a,b) =>  b.cost - a.cost);
      this.items = redeemable;
      this.items.push(...unredeemable);
      this.page = 1;
      this.getData();
    }
  }

  redeemProduct(itemId,itemName) {
    this.itemToRedeem.productId = itemId;
    console.log(itemId);
    this.service.redeemItem(this.itemToRedeem).subscribe(
      responseData => {
        this.toastr.success(
          `${itemName} successfully redeemed`
        );
        this.page = 1;
        this.getUser();
        this.getData();
      }
    )
  }
}
