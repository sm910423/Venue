import { Component, Renderer } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
  pageInfo;

  constructor (public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public renderer: Renderer) {
    this.pageInfo = this.navParams.get('pageInfo');
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);
  }

  closeMoal() {
    this.viewCtrl.dismiss();
  }

}
