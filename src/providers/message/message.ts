import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
@Injectable()
export class MessageProvider {

  constructor(public toastCtrl: ToastController) {
  }

  showMessage(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
}
