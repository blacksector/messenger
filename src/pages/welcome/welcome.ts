import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, Slides,
  AlertController, Platform } from 'ionic-angular';

import { DatabaseProvider } from '../../providers/database/database';

import { ViewChild } from '@angular/core';

import { AndroidPermissions } from '@ionic-native/android-permissions';

declare var SMS:any;

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  messages:any=[];

  @ViewChild(Slides) slides: Slides;

  isNextDisabled: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public nav: Nav, public androidPermissions: AndroidPermissions,
    public alertCtrl: AlertController, public platform: Platform,
    public db: DatabaseProvider) {

  }

  presentAlert(title: string, message: string, buttons: any) {
    let alert = this.alertCtrl.create({
      title: message,
      subTitle: message,
      buttons: buttons
    });
    alert.present();
  }

  continue() {
    this.nav.setRoot('HomePage', {}, {animation: 'ios-transition', animate: true, direction: "forward"});
  }

  nextSlide() {
    //this.slides.slideNext()


    if (this.slides.getActiveIndex() == 0) {
      this.slides.slideNext();
    } else if (this.slides.getActiveIndex() == 1) {
      // TODO: If second slide - ask for permissions

      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS).then(
        success => {
          // Permission already granted previously
          this.slides.slideNext();
          alert("permission granted already");
          this.ReadSMSList();
        },
        err => {
          // Permission not granted, lets ask:
          this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.RECEIVE_SMS,this.androidPermissions.PERMISSION.READ_SMS]).then(
            success => {
              // Permission granted
              this.slides.slideNext();
              alert("permission granted");
              this.ReadSMSList();
            },
            err => {
              // Permission not granted :(
              this.presentAlert("No Permissions", "Without SMS permissions this app will not function. Sorry :(", ["Got It"]);
              this.isNextDisabled = true;
              alert("no permission");
              alert(err);
            }
          )
        }
       )

       // this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]);

    } else if (this.slides.getActiveIndex() == 2) {
      // TODO: If third slide - start processing all of the sms messages
      this.slides.slideNext();



    }


  }

  ReadSMSList() {
    this.platform.ready().then((readySource) => {

      let filter = {
        box : 'inbox', // 'inbox' (default), 'sent', 'draft'
        indexFrom : 0, // start from index 0
        maxCount : 20, // count of SMS to return each time
      };

      if(SMS) SMS.listSMS(filter, (ListSms)=>{
        this.messages=ListSms
      }, error=>{
        alert(JSON.stringify(error))
      });

      this.processSMS();

    });
  }

  processSMS() {

    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {

        var ids = [];

        this.db.existingIds().then(data => {
          ids = data;
        })

        // Here we will start to process the sms and add it to our database
        // Will need to do redundant checks and make sure a sms with the given
        // id doesn't already exist in our data, will sort of make the app slow
        // but this is only a demo app anyway.
        for (var i = 0; i < this.messages.length; i++) {
          let added = false;
          for (var x = 0; x < ids.length; x++) {
            if (this.messages[i]["_id"] == ids[x]) {
              added = true;
            }
          }
          if (!added) {
            //id, thread_id, address, date, date_sent, read, status, type, body, locked, error_code, sub_id, seen
            let id = this.messages[i]["_id"];
            let thread_id = this.messages[i]["thread_id"];
            let address = this.messages[i]["address"];
            let date = this.messages[i]["date"];
            let date_sent = this.messages[i]["date_sent"];
            let read = this.messages[i]["read"];
            let status = this.messages[i]["status"];
            let type = this.messages[i]["type"];
            let body = this.messages[i]["body"];
            let locked = this.messages[i]["locked"];
            let error_code = this.messages[i]["error_code"];
            let sub_id = this.messages[i]["sub_id"];
            let seen = this.messages[i]["seen"];


            // Ok so the sms message does not exist in our database already:
            this.db.addMessage(id, thread_id, address, date, date_sent, read, status, type, body, locked, error_code, sub_id, seen).then(data => {
              this.presentAlert("Done", "Loaded all  new messages to database.", "Ok");
              alert(JSON.stringify(data));
            });
          }

        }

        // Here we will look if the SMS has a thread already in our database:
        // if it does we won't recategorize the sms, otherwise we will
      }
    })


  }




}
