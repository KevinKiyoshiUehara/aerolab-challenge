import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { User } from "../models/user.model";
import { EventEmitter } from "@angular/core";

@Injectable({providedIn: 'root'})

export class AppService {
    user = new EventEmitter<User>();
    resp = [];
    headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjI3NzYzNTA0MTg1ZDAwMjFmMTNmOWYiLCJpYXQiOjE2NDY3NTMzMzN9.hAHDKNwnMhhoYFQOYuMyTghCU2NtHgvMOp6n5RTHJMQ');
    
    baseURL = 'https://coding-challenge-api.aerolab.co/';
    constructor(
        private http: HttpClient,
    ){}
    

    getProducts() {
        return this.http
        .get(this.baseURL+'products',{ 'headers': this.headers })
        .pipe(map(responseData => {
            const productsArray = [];
            for (const key in responseData) {
                if (responseData.hasOwnProperty(key)) {
                    productsArray.push({ ...responseData[key], id: key});
                }
            }
            return productsArray;
        }))
    }

    getUser() {
        return this.http
        .get(this.baseURL+'user/me',{ 'headers': this.headers })
    }

    addPoints(body) {
        return this.http.post(this.baseURL+'user/points', body, { 'headers': this.headers })
    }

    redeemItem(body) {
        return this.http.post(this.baseURL+'redeem', body, { 'headers': this.headers })
    }

    userInformation() {
        return this.user;
    }
}