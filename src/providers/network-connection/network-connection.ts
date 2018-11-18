import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Subscription} from 'rxjs/Subscription';
import { MessageProvider } from '../message/message';
import 'rxjs/add/operator/map';

declare var navigator: any;
declare var Connection: any;

@Injectable()
export class NetworkConnectionProvider {
  connected: Subscription;
  disconnected: Subscription;
  isConnect: boolean = false;
  isOnToOff: boolean = false;
  isOffToOn: boolean = true;
  
  constructor(
    private platform: Platform,
    public network: Network,
    public events: Events,
    public messageProvider: MessageProvider
  ) {
  }
  
  init() {
    this.platform.ready().then(() => {
      var networkState = navigator.connection.type;
      let isConnect:boolean = false;
      if (networkState == Connection.NONE) {
        isConnect = false;
      } else {
        isConnect = true;
      }
      this.isConnect = isConnect;
      
      this.connected = this.network.onConnect().subscribe(data => {
        this.SetNetworkData(data.type, true, false, true);
      }, error => console.error(error));
      
      this.disconnected = this.network.onDisconnect().subscribe(data => {
        this.SetNetworkData(data.type, false, true, false);
      }, error => console.error(error));
    });
  }
  
  SetNetworkData(type, isConnect, isOnToOff, isOffToOn) {
    this.isConnect = isConnect;
    this.isOnToOff = isOnToOff;
    this.isOffToOn = isOffToOn;
    this.displayNetworkUpdate(type);
    this.sendEvents(isConnect);
  }
  
  sendEvents(isConnect) {
    // this.events.publish('Sync:SetNetwork', isConnect);
  }
  
  displayNetworkUpdate(connectionState: string) {
    let error = "You are now " + connectionState;
    this.messageProvider.showMessage(error);
  }
  
  releaseConnects(): void {
    this.connected.unsubscribe();
    this.disconnected.unsubscribe();
  }
  
  procNetworkError(): boolean {
    if (this.isConnect) {
      return false;
    } else {
      this.messageProvider.showMessage("You are now offline.");
      return true;
    }
    // return false;
  }
}
