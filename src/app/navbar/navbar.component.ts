import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user.model';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-navbar-component',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  clicked = true;
  pointsToAdd = { 
    'amount': 0
  };
  noPointsToAdd = true;
  setSelectedButtonBackground1: boolean;
  setSelectedButtonBackground2: boolean;
  setSelectedButtonBackground3: boolean;
  user: User;
  userPromiseResolved: Promise<boolean>;
  constructor(
    private service: AppService,
    private toastr: ToastrService
  ) {
    
  }

  ngOnInit(): void {
    this.getUser();
    this.service.user.subscribe(
      user => this.user = user
    );
  }
  arrowSwap() {
    if (this.clicked) {
      this.clicked = false;
    } else {this.clicked = true}
  }

  selectedPoints(points) {
    const enableAddPointsButton = this.noPointsToAdd = false;
    if (points === 1000) {
      this.pointsToAdd.amount = 1000;
      this.setSelectedButtonBackground1 = true;
      this.setSelectedButtonBackground2 = false;
      this.setSelectedButtonBackground3 = false;
      enableAddPointsButton;
    } else if (points === 5000) {
      this.pointsToAdd.amount = 5000;
      this.setSelectedButtonBackground1 = false;
      this.setSelectedButtonBackground2 = true;
      this.setSelectedButtonBackground3 = false;
      enableAddPointsButton;
    } else if (points === 7500) {
      this.pointsToAdd.amount = 7500;
      this.setSelectedButtonBackground1 = false;
      this.setSelectedButtonBackground2 = false;
      this.setSelectedButtonBackground3 = true;
      enableAddPointsButton;
    }
  }

  getUser() {
    this.service.getUser().subscribe((data: User) => {
      this.user = data;
      this.service.user.emit(this.user);
      this.userPromiseResolved = Promise.resolve(true);
    })
  }

  addPoints() {
    this.service.addPoints(this.pointsToAdd).subscribe(
      responseData =>{
        this.toastr.success(
          `${this.pointsToAdd.amount} aeropoints successfully added`
        )
        this.getUser();
      }
    )
  }
}
