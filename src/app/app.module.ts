import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

import { IonicStorageModule } from '@ionic/storage';

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AndroidPermissions } from '@ionic-native/android-permissions';

import { HttpModule } from '@angular/http';

import { DatabaseProvider } from '../providers/database/database';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { SQLite } from '@ionic-native/sqlite';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    BrowserAnimationsModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AndroidPermissions,
    DatabaseProvider,
    SQLitePorter,
    SQLite
  ]
})
export class AppModule {}
