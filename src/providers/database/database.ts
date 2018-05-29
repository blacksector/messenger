import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';

@Injectable()
export class DatabaseProvider {

  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  constructor(public sqlitePorter: SQLitePorter, private storage: Storage,
    private sqlite: SQLite, private platform: Platform, public http: Http) {
    this.databaseReady = new BehaviorSubject(false);

    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'messages.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.storage.get('database_filled').then(val => {
            if (val) {
              this.databaseReady.next(true);
            } else {
              this.fillDatabase();
            }
            alert("Ready");
          });
        });
    });

  }


  fillDatabase() {
    this.http.get('assets/message.sql')
      .map(res => res.text())
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.databaseReady.next(true);
            this.storage.set('database_filled', true);
            alert("filled database");
          })
          .catch(e => alert(JSON.stringify(e)));
      });

  }


  addMessage(id, thread_id, address, date, date_sent, read, status, type, body, locked, error_code, sub_id, seen) {
    let data = [id, thread_id, address, date, date_sent, read, status, type, body, locked, error_code, sub_id, seen];
    return this.database.executeSql("INSERT INTO inbox (id, thread_id, address, date, date_sent, read, status, type, body, locked, error_code, sub_id, seen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", data).then(data => {
      return data;
    }, err => {
      alert('Error: '+ JSON.stringify(err));
      return err;
    });
  }

  addThreadCategory(thread_id: any, tag: any) {
    let data = [thread_id, tag];
    return this.database.executeSql("INSERT INTO inbox (thread_id, tag) VALUES (?, ?)", data).then(data => {
      return data;
    }, err => {
      alert('Error: '+ JSON.stringify(err));
      return err;
    });
  }

  existingIds() {
    return this.database.executeSql("SELECT id FROM inbox", []).then((data) => {
      let ids = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          ids.push(data.rows.item(i).id);

        }
      }
      return ids;
    }, err => {
      alert('Error: '+ JSON.stringify(err));
      return [];
    });
  }

  existingThreads() {
    return this.database.executeSql("SELECT thread_id FROM threads", []).then((data) => {
      let threads = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          threads.push(data.rows.item(i).id);
        }
      }
      return threads;
    }, err => {
      alert('Error: '+ JSON.stringify(err));
      return [];
    });
  }


  getMessages() {
    return this.database.executeSql("SELECT * FROM inbox", []).then((data) => {
      let messages = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          messages.push(data.rows.item(i));
        }
      }
      return messages;
    }, err => {
      alert('Error: '+ JSON.stringify(err));
      return [];
    });
  }

  getRecentMessages() {
    return this.database.executeSql("SELECT id, MIN(thread_id), address, date, date_sent, read, body FROM inbox GROUP BY thread_id", []).then((data) => {
      let messages = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          messages.push(data.rows.item(i));
        }
      }
      return messages;
    }, err => {
      alert('Error: '+ JSON.stringify(err));
      return [];
    });

  }

  getThreadMessages(thread: string) {
    return this.database.executeSql("SELECT * FROM inbox WHERE thread_id = '"+thread+"'", []).then((data) => {
      let messages = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          messages.push(data.rows.item(i));
        }
      }
      return messages;
    }, err => {
      alert('Error: '+ JSON.stringify(err));
      return [];
    });
  }


  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

}
