import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the HomePopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-popover',
  templateUrl: 'home-popover.html',
})
export class HomePopoverPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController) {
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
