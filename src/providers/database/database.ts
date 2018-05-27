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
    this.http.get('assets/messages.db')
      .map(res => res.text())
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.databaseReady.next(true);
            this.storage.set('database_filled', true);
          })
          .catch(e => console.error(e));
      });
      alert("filled database");
  }


  addMessage(id, thread_id, address, date, date_sent, read, status, type, body, locked, error_code, sub_id, seen) {
    let data = [id, thread_id, address, date, date_sent, read, status, type, body, locked, error_code, sub_id, seen];
    return this.database.executeSql("INSERT INTO inbox (id, thread_id, address, date, date_sent, read, status, type, body, locked, error_code, sub_id, seen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
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
      console.log('Error: ', err);
      return [];
    });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

}
