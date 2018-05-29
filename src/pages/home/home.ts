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
  categories: any = ["All", "Contacts", "Financial", "Authentication", "Promotion", "Unknown"];

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

    this.getSMSFromDB();

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

  openChat(thread_id: any) {

    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getThreadMessages(thread_id).then(data => {
          this.navCtrl.push('ChatPage', {"chatId": thread_id, "messages": data}, {animation: 'ios-transition', animate: true, direction: "forward"});
        })
      }
    })



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


  getSMSFromDB() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getRecentMessages().then(data => {
          this.messages = data;
        })
      }
    })
  }


}
