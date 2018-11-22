import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams, ModalController, Events } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { MessageProvider } from '../../providers/message/message';
import { GlobalProvider } from '../../providers/global/global';
import { HomePage } from '../home/home';
import { DetailsPage } from '../details/details';
import { Storage } from '@ionic/storage';
import { NetworkConnectionProvider } from '../../providers/network-connection/network-connection';

@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  KEY_CATEGORY = "category_data";
  COLITEMS_0: number = 3;
  COLITEMS_1: number = 4;
  COLITEMS_2: number = 3;
  pageId: number;
  pageParent: number;
  typeOfPage: string;
  backgroundImage: string;
  headerImage: string;
  backgroundImageData: string;
  headerImageData: string;
  categories: any = [];
  timeInterval;
  statusInterval;
  closeTimeCount: number = 2;
  isDataFromServer = true;

  constructor(public navCtrl: NavController, public network: NetworkConnectionProvider, public storage: Storage, public events: Events, public navParams: NavParams, public http: HttpProvider, public message: MessageProvider, public loadingCtrl: LoadingController, public global: GlobalProvider, public modalCtrl: ModalController) {
    this.pageId = this.navParams.get('pageId');
  }

  ionViewDidEnter() {
    this.global.getStatus(false);

    if (this.typeOfPage == 'MAIN CATEGORY') {
      this.timeInterval = setInterval(this.countCloseTime.bind(this), 1000);
    }

    this.statusInterval = setInterval(() => {
      this.global.getStatus(false);
    }, this.global.status.statusCheckTime * 1000);

    this.events.subscribe(this.global.EVENT_CONTENT_UPDATE, () => {
      this.getPageData(this.pageId);
    });
  }

  ionViewWillLeave() {
    clearInterval(this.timeInterval);
    clearInterval(this.statusInterval);
    this.events.unsubscribe(this.global.EVENT_CONTENT_UPDATE);
  }

  countCloseTime() {
    if (this.closeTimeCount ++ >= this.global.status.redirectTime) {
      this.goToHomePage();
    }
  }

  getPageData(id) {
    this.backgroundImage = "";
    this.headerImage = "";
    this.backgroundImageData = "";
    this.headerImageData = "";

    if (this.network.procNetworkError() || !this.global.status.update_content) {
      this.getPageDataFromLocal(this.pageId);
    } else {
      this.getPageDataFromServer(this.pageId);
    }
  }

  getPageDataFromLocal(id: number) {
    this.isDataFromServer = false;
    let loading = this.loadingCtrl.create();
    loading.present();

    let key = this.KEY_CATEGORY + id.toString();
    this.storage.get(key).then((data) => {
      loading.dismiss();

      if (data && data.pageData && data.pageInfo) {
        this.pageParent = data.pageData.pageParent;
        this.backgroundImageData = data.pageData.backgroundImageData;
        this.headerImageData = data.pageData.headerImageData;
        this.typeOfPage = data.pageData.typeOfPage;
        this.categories = data.pageInfo;
      } else {
        this.noSavedData(id);
      }
    }).catch(err => {
      loading.dismiss();
      console.log('storage error', err);
      this.noSavedData(id);
    });
  }

  getPageDataFromServer(id: number, isNoData = false) {
    this.isDataFromServer = true;
    let url = this.http.MENU_PAGE_DATE;
    let jsonData: any = {venue_id: this.global.user.id, token: this.global.user.token};
    if (id != -1) {
      jsonData.page_id = id;
    }
    let categories = [];

    let loading = this.loadingCtrl.create();
    loading.present();
    this.http.post(url, jsonData).then((data: any) => {
      loading.dismiss();
      if (data) {
        let res = data.json();
        if (res && res.responseCode == "401" && res.pageData && res.pageInfo) {
          this.backgroundImage = res.pageData.pageBackground;
          this.headerImage = res.pageData.pageHeader;
          this.pageParent = res.pageData.pageParent;
          this.typeOfPage = res.pageData.typeOfPage;
          let step = (this.typeOfPage == 'MAIN CATEGORY' ? this.COLITEMS_0 : this.typeOfPage == 'CATEGORY' ? this.COLITEMS_1 : this.COLITEMS_2);
          for (let i = 0; i < res.pageInfo.length; i += step) {
            let arr = [];
            for (let j = 0; j < step && (i + j) < res.pageInfo.length; j ++) {
              arr.push(res.pageInfo[i + j]);
            }
            categories.push(arr);
          }
          this.categories = categories;
          this.saveToLocal(this.pageId);
        } else if (isNoData) {
          this.noSavedDataOffline();
        }
      } else if (isNoData) {
        this.noSavedDataOffline();
      }
    }).catch((err) => {
      loading.dismiss();
      console.log(err);
      if (isNoData) {
        this.noSavedDataOffline();
      }
    });
  }
  
  async saveToLocal(id: number) {
    let backgroundImageData = await this.global.toDataURL(this.backgroundImage);
    let headerImageData = await this.global.toDataURL(this.headerImage);
    let categories: any = [];
    for (let i = 0; i < this.categories.length; i ++) {
      let elements1 = [];
      let elements = this.categories[i];
      for (let j = 0; j < elements.length; j ++) {
        let element = elements[j];
        element.categoryImageData = await this.global.toDataURL(element.categoryImage);
        elements1.push(element);
      }
      categories.push(elements1);
    }
    let key = this.KEY_CATEGORY + id.toString();
    this.storage.set(key, {pageData: {pageId: this.pageId, pageParent: this.pageParent, backgroundImageData, headerImageData, typeOfPage: this.typeOfPage}, pageInfo: categories});
  }

  noSavedData(id: number) {
    this.getPageDataFromServer(id, true);
  }

  noSavedDataOffline() {
    alert('There is no saved data for this page.');
    // if (this.pageLevel == 0) {
    //   this.goToHomePage();
    // } else {
    //   this.goBack();
    // }
  }

  goBack() {
    this.navCtrl.pop();
  }

  goMain() {
    this.navCtrl.popToRoot();
  }

  goToHomePage() {
    this.global.status.update_content = undefined;
    this.global.status.update_picture = undefined;
    this.navCtrl.setRoot(HomePage);
  }

  goToCategoryPage(pageId) {
    if (pageId > 0) {
      this.global.status.update_content = undefined;
      this.global.status.update_picture = undefined;
      this.closeTimeCount = 0;
      this.navCtrl.push(CategoryPage, {pageId: pageId});
    }
  }

  openModal(pageInfo) {
    this.modalCtrl.create(DetailsPage, {pageInfo: pageInfo}).present();
  }

}
