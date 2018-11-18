import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpProvider {
  // BASE_URL      = "https://www.myomg.com.au/VenueMenu/";
  // LOGIN         = this.BASE_URL + "Login";
  // HOME          = this.BASE_URL + "GetScreens";
  
  LOGIN           = "/api/Login";
  SLIDING_IMAGES  = "/api/GetScreens";
  
  contentHeader: Headers = new Headers({"Content-Type": "application/json"});
  
  constructor (
    public http: Http
  ) {
    
  }

  setHeader(json) {
    this.contentHeader.append('venue_id', json.venue_id);
    this.contentHeader.append('token', json.token);
  }

  post(url, json) {
    console.log("POST Request");
    return new Promise((resolve, reject) => {
      console.log(JSON.stringify(url));
      console.log(JSON.stringify(json));
      this.http.post(url, JSON.stringify(json), { headers : this.contentHeader })
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
