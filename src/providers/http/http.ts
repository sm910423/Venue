import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpProvider {
  BASE_URL      = "https://www.myomg.com.au/VenueMenu/";
  LOGIN           = this.BASE_URL + "Login";
  SLIDING_IMAGES  = this.BASE_URL + "GetScreens";
  MENU_PAGE_DATE  = this.BASE_URL + "Pages";
  STATUS          = this.BASE_URL + "GetStatus";
  
  constructor (
    public http: Http
  ) {
    
  }

  post(url, json) {
    console.log("POST Request");
    return new Promise((resolve, reject) => {
      console.log(JSON.stringify(url));
      console.log(JSON.stringify(json));
      this.http.post(url, JSON.stringify(json))
        .subscribe(data => {
          console.log("success", JSON.stringify(data));
          resolve(data);
        }, err => {
          console.log("error", JSON.stringify(err));
          reject(err);
        });
    });
  }

  get(url) {
    console.log("GET Request");
    return new Promise((resolve, reject) => {
      console.log(JSON.stringify(url));
      this.http.get(url)
        .subscribe(data => {
          console.log("success", JSON.stringify(data));
          resolve(data);
        }, err => {
          console.log("error", JSON.stringify(err));
          reject(err);
        });
    });
  }
}
