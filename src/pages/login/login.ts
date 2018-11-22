import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpProvider } from '../../providers/http/http';
import { MessageProvider } from '../../providers/message/message';
import { HomePage } from '../home/home';
import { GlobalProvider } from '../../providers/global/global';
import { Device } from '@ionic-native/device';
import { NetworkConnectionProvider } from '../../providers/network-connection/network-connection';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  login: FormGroup;
  main_page: { component: any };
  loading: any;
  
  constructor(
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public http: HttpProvider,
    public storage: Storage,
    public message: MessageProvider,
    public global: GlobalProvider,
    private device: Device,
    public network: NetworkConnectionProvider
  ) {
    this.main_page = { component: HomePage };
    
    this.login = new FormGroup({
      usersEmail: new FormControl('enquiries@eastwoodhotel.com.au', Validators.required),
      usersPassword: new FormControl('thetest', Validators.required)
    });
    
    this.loading = this.loadingCtrl.create();
  }
  
  doLogin() {
    if (this.network.procNetworkError()) {
      this.message.showMessage("Please check your wifi");
      return;
    }

    let url = this.http.LOGIN;
    let jsonData: any = {};
    jsonData.venEmail = this.login.getRawValue().usersEmail;
    jsonData.venPassword = this.login.getRawValue().usersPassword;
    jsonData.venDeviceId = this.device.uuid; // not test code
    // jsonData.venDeviceId = '123123123';  // test code

    let loading = this.loadingCtrl.create();
    loading.present();
    this.http.post(url, jsonData).then((data:any) => {
      loading.dismiss();
      let body: string = data._body;
      let bodyJson = JSON.parse(body.substr(0, body.length - 1))
      if (bodyJson.responseCode == "201") {
        if (bodyJson.venueData != null && bodyJson.venueData != undefined) {
          let user = {id: bodyJson.venueData.venue_id, name: bodyJson.venueData.venue_name, token: bodyJson.venueData.token};
          this.global.user = user;
          this.storage.set("user", user).then(data => {
            this.nav.setRoot(this.main_page.component);
          }).catch(err => {
            this.nav.setRoot(this.main_page.component);
          });
        } else {
          this.nav.setRoot(this.main_page.component);
        }
      }
    }).catch(err => {
      loading.dismiss();
      this.message.showMessage("Sorry, There is any error");
    });
  }
  
}
