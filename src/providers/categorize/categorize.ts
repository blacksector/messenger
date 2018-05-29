import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

import { DatabaseProvider } from '../database/database';

@Injectable()
export class CategorizeProvider {


  messages: any = [];

  // This will need to be loaded dynamically from phone
  contacts: any = ["+16474704804"];

  constructor(private storage: Storage, public db: DatabaseProvider) {
    // this.storage.get('categories').then(val => {
    //   if (val) {
    //     this.categories.concat(val);
    //   }
    // })
  }

  categorizeThread(thread_id: string) {
    this.db.getDatabaseState().subscribe(rdy => {
      var that = this;
      this.db.getThreadMessages(thread_id).then(data => {
        that.messages = data;

        for (var i = 0; i < data.length; i++) {

          // Lets go through all the possible cases:
          if (this.contacts.indexOf(data[i].address) > -1) {
            // This is a contact:

            that.db.addThreadCategory(data[i].thread_id, "Contacts").then(data => {
              // Done saving
            });
            break;
          } else if (this.checkAuthentication()) {
            // This is probably an authentication message or thread:
            that.db.addThreadCategory(data[i].thread_id, "Authentication").then(data => {
              // Done saving
            });
            break;
          }

        }

      });

    })



  }

  checkAuthentication() {



  }




}
