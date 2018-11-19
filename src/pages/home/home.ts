import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, Slides } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { MessageProvider } from '../../providers/message/message';
import { GlobalProvider } from '../../providers/global/global';
import { CategoryPage } from '../category/category';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;
  slidingImages;
  slidesInterval;
  
  constructor(public navCtrl: NavController, public http: HttpProvider, public message: MessageProvider, public loadingCtrl: LoadingController, public global: GlobalProvider) {
    this.getSlidingImages();
  }

  ionViewDidEnter() {
    if (this.slidingImages.length > 0) {
      this.slidesAutoPlay();
    }
  }

  ionViewWillLeave() {
    this.slides.stopAutoplay();
  }
  
  getSlidingImages() {
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
        }
      }
    }).catch((err) => {
      loading.dismiss();
      console.log(err);
    });
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
    this.navCtrl.setRoot(CategoryPage, {pageLevel: 0, pageId: -1});
  }
}
