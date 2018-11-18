import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, Slides } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { MessageProvider } from '../../providers/message/message';
import { GlobalProvider } from '../../providers/global/global';

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
        if (res && res.responseCode == "401") {
          this.slidingImages = res.ScreenData;
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
      // this.slides.lockSwipeToPrev(true);
      // this.slidesInterval = setInterval(this.goNextSlide.bind(this), 2000);
      this.slides.freeMode = true;
      this.slides.autoplay = 2000;
      this.slides.speed = 500;
      this.slides.loop = true;
      this.slides.autoplayDisableOnInteraction = false;
      this.slides.startAutoplay();
    }, 100);
  }

  goNextSlide() {
    this.slides.lockSwipeToNext(false);
    if (this.slides.isEnd()) {
      console.log("end");
      this.slides.slideNext();
    } else {
      this.slides.slideNext();
    }
    this.slides.lockSwipeToNext(true);
  }

  readyChange() {
    console.log("aaa");
    this.slides.lockSwipes(false);
  }

  didChange() {
    console.log("bbb");
    this.slides.lockSwipes(true);
  }
}
