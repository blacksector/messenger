import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,
  PopoverController, Platform } from 'ionic-angular';

// Animations
import { trigger, transition, style, animate, state } from '@angular/animations';

import { DatabaseProvider } from '../../providers/database/database';

declare var SMS:any;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
   trigger(
     'conversationAnimation',
     [
       transition(
       ':enter', [
         style({transform: 'translateX(30%)', opacity: 0}),
         animate('800ms', style({transform: 'translateX(0)', 'opacity': 1}))]
       // )
       ),
       transition(
       ':leave', [
         style({transform: 'translateX(0)', 'opacity': 1}),
         animate('500ms', style({transform: 'translateX(50%)', 'opacity': 0.5})),
         animate('500ms', style({transform: 'translateX(100%)', 'opacity': 0}))
       ]
       )
     ]
   ),
   trigger(
     'slideUpAndDown',
     [
       transition(
       ':enter', [
         style({transform: 'translateY(100%)', opacity: 0}),
         animate('200ms', style({transform: 'translateY(50%)', 'opacity': 0.5})),
         animate('200ms', style({transform: 'translateY(0)', 'opacity': 1}))
       ]
       ),
       transition(
       ':leave', [
         style({transform: 'translateY(0)', 'opacity': 1}),
         animate('200ms', style({transform: 'translateY(50%)', 'opacity': 0.5})),
         animate('200ms', style({transform: 'translateY(100%)', 'opacity': 0}))
       ]
       )
     ]
   )
 ],
})
export class HomePage {

  messages:any=[];

  ids: any = [];

  showSearch: boolean = false;

  // Categories:
  selectedCategory: any = "All";
  categories: any = ["All", "Contacts", "Financial", "OTP", "Promotion", "Unknown"];

  // Contacts
  sortedContacts: any = [
   {
     id: 1,
     name: "Omar Quazi",
     color: "#0652DD",
     lastMessage: false,
     lastMessageContent: "Hey there! asfasdf asdf safsadf sadf asf fasdfsdfasd ",
     lastMessageOpened: true,
     lastMessageTime: 1527157000568
   }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, public popoverCtrl: PopoverController,
    public platform: Platform, public db: DatabaseProvider) {

    this.ReadSMSList();

  }

  createToast(message: string) {
    return this.toastCtrl.create({
      message,
      duration: 3000
    })
  }

  categoryChanged(event: any) {
    let newCategory = event._value;
    this.createToast("Selected Category: " + event._value).present();
  }

  openChat(id: number) {

    this.navCtrl.push('ChatPage', {"chatId": id}, {animation: 'ios-transition', animate: true, direction: "forward"});

  }

  search(ev? : any) {
    this.showSearch = !this.showSearch;
  }

  getItems() {

  }

  more(myEvent: UIEvent) {
    let popover = this.popoverCtrl.create('HomePopoverPage');

    let ev = {
      target : {
        getBoundingClientRect : () => {
          return {
            top: '0',
            left: '100'
          };
        }
      }
    };

    popover.present({ev});
  }


  deleteConversations(id: number) {
    this.sortedContacts.splice(0,1);
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

    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {

        this.db.existingIds().then(data => {
          this.ids = data;
        })

        // Here we will start to process the sms and add it to our database
        // Will need to do redundant checks and make sure a sms with the given
        // id doesn't already exist in our data, will sort of make the app slow
        // but this is only a demo app anyway.
        for (var i = 0; i < this.messages.length; i++) {
          let added = false;
          for (var x = 0; x < this.ids.length; x++) {
            if (this.messages[i]["_id"] == this.ids[x]) {
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

            alert("Added: " + this.messages[i]["_id"]);

            // Ok so the sms message does not exist in our database already:
            this.db.addMessage(id, thread_id, address, date, date_sent, read, status, type, body, locked, error_code, sub_id, seen).then(data => {
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
