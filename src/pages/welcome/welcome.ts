import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, Slides,
  AlertController, Platform, LoadingController } from 'ionic-angular';

import { DatabaseProvider } from '../../providers/database/database';

import { CategorizeProvider } from '../../providers/categorize/categorize';

import { ViewChild } from '@angular/core';

import { AndroidPermissions } from '@ionic-native/android-permissions';

declare var SMS:any;

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  @ViewChild(Slides) slides: Slides;

  messages:any=[];

  ids: any = [];

  isNextDisabled: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public nav: Nav, public androidPermissions: AndroidPermissions,
    public alertCtrl: AlertController, public platform: Platform,
    public db: DatabaseProvider, public categorize: CategorizeProvider,
    public loadingCtrl: LoadingController) {

  }

  presentAlert(title: string, message: string, buttons: any) {
    let alert = this.alertCtrl.create({
      title: message,
      subTitle: message,
      buttons: buttons
    });
    alert.present();
  }

  createLoading(message: string) {
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: message
    });
    return loading;
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
        maxCount : 10, // count of SMS to return each time
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
    var that = this;
    var loader = this.createLoading('Processing SMS...');
    loader.present();
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {

        this.db.existingIds().then(data => {
          this.ids = data;

          // Here we will start to process the sms and add it to our database
          // Will need to do redundant checks and make sure a sms with the given
          // id doesn't already exist in our data, will sort of make the app slow
          // but this is only a demo app anyway.

          var threads = [];

          for (var i = 0; i < that.messages.length; i++) {
            let added = false;


            for (var x = 0; x < that.ids.length; x++) {
              if (parseInt(that.messages[i]["_id"]) == parseInt(that.ids[x])) {
                added = true;
              }
            }
            if (added === false) {
              //id, thread_id, address, date, date_sent, read, status, type, body, locked, error_code, sub_id, seen
              let id = that.messages[i]["_id"];
              let thread_id = that.messages[i]["thread_id"];
              let address = that.messages[i]["address"];
              let date = that.messages[i]["date"];
              let date_sent = that.messages[i]["date_sent"];
              let read = that.messages[i]["read"];
              let status = that.messages[i]["status"];
              let type = that.messages[i]["type"];
              let body = that.messages[i]["body"];
              let locked = that.messages[i]["locked"];
              let error_code = that.messages[i]["error_code"];
              let sub_id = that.messages[i]["sub_id"];
              let seen = that.messages[i]["seen"];


              // Ok so the sms message does not exist in our database already:
              that.db.addMessage(id, thread_id, address, date, date_sent, read, status, type, body, locked, error_code, sub_id, seen).then(data => {
                // Added message, "data" contains our return statement
              });

              threads.push(thread_id);

            }

          }

          // Check if there are any new "threads" in plain english, check if there
          // are any new conversations created.
          that.db.existingThreads().then(data => {
            var existingThreads = data;
            for (var i = 0; i < threads.length; i++) {
              if (existingThreads.indexOf(threads[i]) === -1) {
                // This is a new thread, lets process this thread!:
                that.categorize.categorizeThread(String(threads[i]));
              }
            }
          });

          // Messages have been added, lets start processing the sms and categorizing them.


        })

        // Dismiss the loader
        loader.dismiss();
      }
    })


  }




}
