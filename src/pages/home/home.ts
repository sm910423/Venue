import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, Slides, Events } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { MessageProvider } from '../../providers/message/message';
import { GlobalProvider } from '../../providers/global/global';
import { CategoryPage } from '../category/category';
import { Storage } from '@ionic/storage';
import { NetworkConnectionProvider } from '../../providers/network-connection/network-connection';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  KEY_SLIDING_IMAGES = "sliding_images";
  @ViewChild(Slides) slides: Slides;
  slidingImages;
  slidesInterval;
  isDataFromServer = true;
  statusInterval;
  
  constructor(public navCtrl: NavController, public network: NetworkConnectionProvider, public events: Events, public storage: Storage, public http: HttpProvider, public message: MessageProvider, public loadingCtrl: LoadingController, public global: GlobalProvider) {
    this.events.subscribe(this.global.EVENT_PICTURE_UPDATE, () => {
      this.getData();
    });
    this.storage.forEach((value, key) => {
      console.log(key);
    });
  }

  async ionViewDidLoad() {
    let loading = this.loadingCtrl.create();
    loading.present();
    await this.global.getStatus();
    loading.dismiss();
  }
  
  ionViewDidEnter() {
    this.events.unsubscribe(this.global.EVENT_PICTURE_UPDATE);
    this.events.subscribe(this.global.EVENT_PICTURE_UPDATE, () => {
      this.getData();
    });
    this.statusInterval = setInterval(() => {
      this.global.getStatus();
    }, this.global.status.statusCheckTime * 1000);
  }
  
  ionViewWillLeave() {
    this.events.unsubscribe(this.global.EVENT_PICTURE_UPDATE);
    this.slides.stopAutoplay();
    clearInterval(this.statusInterval);
  }
  
  getData() {
    this.slides.stopAutoplay();
    if (/*this.network.procNetworkError() || */!this.global.status.update_picture) {
      this.getSlidingImagesFromLocal();
    } else {
      this.getSlidingImagesFromServer();
    }
  }
  
  getSlidingImagesFromServer(isNodata = false) {
    console.log("getSlidingImagesFromLocal");
    this.isDataFromServer = true;
    this.slidingImages = [];
    let url = this.http.SLIDING_IMAGES;
    let jsonData: any = {venue_id: this.global.user.id, token: this.global.user.token};
    
    let loading = this.loadingCtrl.create();
    loading.present();
    this.http.post(url, jsonData).then((data:any) => {
      loading.dismiss();
      if (data) {
        let res = data.json();
        if (res && res.responseCode == "401" && res.ScreenData && res.ScreenData.length > 0) {
          res.ScreenData.forEach((element, index) => {
            if (index > 0) {
              this.slidingImages.push(element);
            }
          });
          this.slidingImages.push(res.ScreenData[0]);
          this.slidingImages.splice(0, 0, this.slidingImages[this.slidingImages.length - 1]);
          this.slidesAutoPlay();
          this.saveToLocal();
        } else if (isNodata) {
          this.noSavedDataOffline();
        }
      } else if (isNodata) {
        this.noSavedDataOffline();
      }
    }).catch((err) => {
      loading.dismiss();
      console.log(err);
      if (isNodata) {
        this.noSavedDataOffline();
      }
    });
  }
  
  getSlidingImagesFromLocal() {
    console.log("getSlidingImagesFromLocal");

    this.isDataFromServer = false;
    let loading = this.loadingCtrl.create();
    loading.present();

    this.slidingImages = [];
    this.storage.get(this.KEY_SLIDING_IMAGES).then(val => {
      loading.dismiss();
      if (val && val.length) {
        this.slidingImages = val;
        this.slidesAutoPlay();
      } else {
        this.noSavedData();
      }
    }).catch(err => {
      loading.dismiss();
      console.log(err);
      this.noSavedData();
    });
  }
  
  async saveToLocal() {
    let images: any = [];
    for (let i = 0; i < this.slidingImages.length; i ++) {
      let element = this.slidingImages[i];
      let imageData = await this.global.toDataURL(element.location);
      if (imageData) {
        images.push({id: element.id, imageData});
      } else {
        images.push(element);
      }
    }
    this.storage.set(this.KEY_SLIDING_IMAGES, images);
  }

  noSavedData() {
    this.getSlidingImagesFromServer(true);
  }

  noSavedDataOffline() {
    alert('You must go online.');
    // navigator['app'].exitApp();
  }
  
  slidesAutoPlay() {
    setTimeout(() => {
      this.slides.freeMode = true;
      this.slides.autoplay = 2000;
      this.slides.speed = 500;
      this.slides.loop = true;
      this.slides.autoplayDisableOnInteraction = false;
      this.slides.startAutoplay();
    }, 100);
  }
  
  goToCategoryPage() {
    this.navCtrl.setRoot(CategoryPage, {pageId: -1});
  }
}
