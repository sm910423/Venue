import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { HttpProvider } from '../providers/http/http';
import { MessageProvider } from '../providers/message/message';
import { NetworkConnectionProvider } from '../providers/network-connection/network-connection';
import { ShowHideContainer } from '../components/show-hide-password/show-hide-container';
import { ShowHideInput } from '../components/show-hide-password/show-hide-input';
import { LoginPage } from '../pages/login/login';
import { HttpModule } from '@angular/http';
import { GlobalProvider } from '../providers/global/global';
import { CategoryPage } from '../pages/category/category';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ShowHideContainer,
    ShowHideInput,
    LoginPage,
    CategoryPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    CategoryPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpProvider, 
    MessageProvider, 
    NetworkConnectionProvider,
    GlobalProvider
  ]
})
export class AppModule {}
