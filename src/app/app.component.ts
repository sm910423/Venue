import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { GlobalProvider } from '../providers/global/global';
import { NetworkConnectionProvider } from '../providers/network-connection/network-connection';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public storage: Storage, public global: GlobalProvider, public network: NetworkConnectionProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    // this.network.init();

    this.setRootPage();
  }

  setRootPage() {
    this.storage.get("user").then((userInfo) => {
      if (userInfo) {
        this.global.user = userInfo;
        this.rootPage = HomePage;  // not test code
        // this.rootPage = LoginPage;    // test code
      } else {
        this.rootPage = LoginPage;
      }
    }).catch(() => {
      this.rootPage = LoginPage;
    });
  }
}

