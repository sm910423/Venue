import { Injectable } from '@angular/core';
import { HttpProvider } from '../http/http';
import { Events } from 'ionic-angular';
import { NetworkConnectionProvider } from '../network-connection/network-connection';
import { Storage } from '@ionic/storage';

@Injectable()
export class GlobalProvider {
  public EVENT_CONTENT_UPDATE = 'content_update';
  public EVENT_PICTURE_UPDATE = 'picture_update';
  public INTERVAL_FOR_STATUS: number = 120;
  public INTERVAL_FOR_GO_BACK: number = 60;
  public user;
  public status = {update_content: undefined, update_picture: undefined, statusCheckTime: 0, redirectTime: 0};

  
  constructor (public http: HttpProvider, public events: Events, public network: NetworkConnectionProvider, public storage: Storage) {
    this.getStatus();
  }
  
  getStatus(isFromSliding = true) {
    if (this.user == null || this.user == undefined) {
      return;
    }
    this.status.statusCheckTime = this.INTERVAL_FOR_STATUS;
    this.status.redirectTime = this.INTERVAL_FOR_GO_BACK;

    if (this.network.procNetworkError()) {
      if (this.status.update_content == undefined) {
        this.events.publish(this.EVENT_CONTENT_UPDATE);
      }
      if (this.status.update_picture == undefined) {
        this.events.publish(this.EVENT_PICTURE_UPDATE);
      }
      this.status.update_content = false;
      this.status.update_picture = false;
      return;
    }

    let url = this.http.STATUS;
    let jsonData: any = {venue_id: this.user.id, token: this.user.token};
    
    this.http.post(url, jsonData).then((data:any) => {
      if (data) {
        let res = data.json();
        if (res && res.responseCode == "901") {
          this.status.statusCheckTime = res.statuscheckTime;
          this.status.redirectTime = res.redirectTime;
          this.status.redirectTime = this.INTERVAL_FOR_GO_BACK;
          let update_content = res.update_required == 'YES' ? true : false;
          let update_picture = res.update_pictures == 'YES' ? true : false;

          if (!isFromSliding && (update_content || (this.status.update_content == undefined && update_content == false))) {
            this.status.update_content = update_content;
            this.events.publish(this.EVENT_CONTENT_UPDATE);
          }
          if (isFromSliding && (update_picture || (this.status.update_picture == undefined && update_picture == false))) {
            this.status.update_picture = update_picture;
            this.events.publish(this.EVENT_PICTURE_UPDATE);
          }

          if (update_content) {
            this.storage.forEach((value, key) => {
              if (key.search('category_data') >= 0) {
                this.storage.remove(key);
              }
            })
          }
        }
      }
    });
  }
  
  toDataURL(url) {
    return new Promise((resolve) => {
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
          resolve(reader.result);
        }
        reader.readAsDataURL(xhr.response);
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }

  toDataURL1(url) {
    return new Promise((resolve) => {
      fetch(url)
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        // reader.onerror = reject
        reader.readAsDataURL(blob)
      }));
    });
  }
  
}
