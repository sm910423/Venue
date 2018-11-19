import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { MessageProvider } from '../../providers/message/message';
import { GlobalProvider } from '../../providers/global/global';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  COLITEMS_0: number = 3;
  COLITEMS_1: number = 4;
  COLITEMS_2: number = 2;
  pageLevel: number;
  pageId: number;
  backgroundImage: string;
  headerImage: string;
  categories: any = [];
  timeInterval;
  closeTimeMin: number = 2;
  closeTimeCount: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpProvider, public message: MessageProvider, public loadingCtrl: LoadingController, public global: GlobalProvider) {
    this.pageLevel = this.navParams.get('pageLevel');
    this.pageId = this.navParams.get('pageId');
    this.getPageData(this.pageId);
  }

  ionViewDidEnter() {
    if (this.pageLevel == 0) {
      this.timeInterval = setInterval(this.countCloseTime.bind(this), 1000);
    }
  }

  ionViewWillLeave() {
    clearInterval(this.timeInterval);
  }

  countCloseTime() {
    if (this.closeTimeCount ++ >= this.closeTimeMin * 60) {
      this.navCtrl.setRoot(HomePage);
    }
  }

  getPageData(id) {
    this.backgroundImage = "";
    this.headerImage = "";
    this.categories = [];
    let url = this.http.MENU_PAGE_DATE;
    let jsonData: any = {venue_id: this.global.user.id, token: this.global.user.token};
    if (id != -1) {
      jsonData.page_id = id;
    }

    let loading = this.loadingCtrl.create();
    loading.present();
    this.http.post(url, jsonData).then((data: any) => {
      loading.dismiss();
      if (data) {
        let res = data.json();
        this.backgroundImage = res.pageData.pageBackground;
        this.headerImage = res.pageData.pageHeader;
        let step = (this.pageLevel == 0 ? this.COLITEMS_0 : this.pageLevel == 1 ? this.COLITEMS_1 : this.COLITEMS_2);
        for (let i = 0; i < res.pageInfo.length; i += step) {
          let arr = [];
          for (let j = 0; j < step && (i + j) < res.pageInfo.length; j ++) {
            arr.push(res.pageInfo[i + j]);
          }
          this.categories.push(arr);
        }
      }
    }).catch((err) => {
      loading.dismiss();
      console.log(err);
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  goHome() {
    this.navCtrl.popToRoot();
  }

  goToCategoryPage(pageId) {
    if (pageId > 0) {
      this.closeTimeCount = 0;
      this.navCtrl.push(CategoryPage, {pageLevel: this.pageLevel + 1, pageId: pageId});
    }
  }

}
