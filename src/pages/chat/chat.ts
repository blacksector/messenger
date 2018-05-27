import { Component, ViewChild } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, Content, TextInput } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: TextInput;

  contact = {
    id: 1,
    name: "Omar Quazi",
    number: "6470001111",
    color: "#0652DD"
  }

  user: {
    id: "140000198202211138",
    name: "Omar"
  };
  userId = "140000198202211138";
  toUserId = "210000198410281948";
  toUser: {
    id: "210000198410281948",
    name: "Hancock"
  };
  editorMsg = '';
  showEmojiPicker = false;

  personName: string = "John Smith";

  msgList = [
    {
      "messageId":"1",
      "userId":"140000198202211138",
      "userName":"Omar",
      "userImgUrl":"assets/imgs/default-user-image.png",
      "toUserId":"210000198410281948",
      "toUserName":"Hancock",
      "userAvatar":"assets/imgs/default-user-image.png",
      "time":1488349800000,
      "message":"A good programmer is someone who always looks both ways before crossing a one-way street. ",
      "status":"success"

    },
    {
      "messageId":"2",
      "userId":"210000198410281948",
      "userName":"Hancock",
      "userImgUrl":"assets/imgs/default-user-image.png",
      "toUserId":"140000198202211138",
      "toUserName":"Omar",
      "userAvatar":"assets/imgs/default-user-image.png",
      "time":1491034800000,
      "message":"Don’t worry if it doesn't work right. If everything did, you’d be out of a job.",
      "status":"success"
    },
    {
      "messageId":"3",
      "userId":"140000198202211138",
      "userName":"Omar",
      "userImgUrl":"assets/imgs/default-user-image.png",
      "toUserId":"210000198410281948",
      "toUserName":"Hancock",
      "userAvatar":"assets/imgs/default-user-image.png",
      "time":1491034920000,
      "message":"Most of you are familiar with the virtues of a programmer. There are three, of course: laziness, impatience, and hubris.",
      "status":"success"
    },
    {
      "messageId":"4",
      "userId":"210000198410281948",
      "userName":"Hancock",
      "userImgUrl":"assets/imgs/default-user-image.png",
      "toUserId":"140000198202211138",
      "toUserName":"Omar",
      "userAvatar":"assets/imgs/default-user-image.png",
      "time":1491036720000,
      "message":"One man’s crappy software is another man’s full time job.",
      "status":"success"
    },
    {
      "messageId":"5",
      "userId":"210000198410281948",
      "userName":"Hancock",
      "userImgUrl":"assets/imgs/default-user-image.png",
      "toUserId":"140000198202211138",
      "toUserName":"Omar",
      "userAvatar":"assets/imgs/default-user-image.png",
      "time":1491108720000,
      "message":"Programming is 10% science, 20% ingenuity, and 70% getting the ingenuity to work with the science.",
      "status":"success"
    },
    {
      "messageId":"6",
      "userId":"140000198202211138",
      "userName":"Omar",
      "userImgUrl":"assets/imgs/default-user-image.png",
      "toUserId":"210000198410281948",
      "toUserName":"Hancock",
      "userAvatar":"assets/imgs/default-user-image.png",
      "time":1491231120000,
      "message":"If at first you don’t succeed, call it version 1.0",
      "status":"success"
    },
    {
      "messageId":"7",
      "userId":"140000198202211138",
      "userName":"Omar",
      "userImgUrl":"assets/imgs/default-user-image.png",
      "toUserId":"210000198410281948",
      "toUserName":"Hancock",
      "userAvatar":"assets/imgs/default-user-image.png",
      "time":1491231150000,
      "message":"The <textarea> tag defines a multi-line text input control.\nA text area can hold an unlimited number of characters, and the text renders in a fixed-width font (usually Courier).\nThe size of a text area can be specified by the cols and rows attributes, or even better; through CSS' height and width properties.",
      "status":"success"
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    platform: Platform) {

    platform.registerBackButtonAction(() => {
      this.navCtrl.pop({animation: 'ios-transition', animate: true, direction: "back"});
    },1);
  }

  goBack() {
    this.navCtrl.pop({animation: 'ios-transition', animate: true, direction: "back"});
  }

  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }




  sendMsg() {
    if (!this.editorMsg.trim()) {
      return;
    }

    // Mock message
    let newMsg = {
      messageId: Date.now().toString(),
      userId: "140000198202211138",
      userName: "Omar",
      toUserId: "210000198410281948",
      time: Date.now(),
      userAvatar: "assets/imgs/default-user-image.png",
      message: this.editorMsg,
      status: 'pending'
    };

    this.pushNewMsg(newMsg);
    this.editorMsg = '';
  }

   pushNewMsg(msg: any) {
     const userId = "140000198202211138", toUserId = "210000198410281948";
     // Verify user relationships
     if (msg.userId === userId && msg.toUserId === toUserId) {
      this.msgList.push(msg);
     } else if (msg.toUserId === userId && msg.userId === toUserId) {
      this.msgList.push(msg);
     }
     this.scrollToBottom();
   }

   getMsgIndexById(id: string) {
     return this.msgList.findIndex(e => e.messageId === id)
   }

   scrollToBottom() {
     setTimeout(() => {
       if (this.content.scrollToBottom) {
         this.content.scrollToBottom();
       }
     }, 400)
   }

  // ionViewWillLeave() {
  //   this.canLeave = true;
  //   this.navCtrl.pop({animation: 'ios-transition', animate: true, direction: "backward"});
  // }

  // ionViewCanLeave(): boolean{
  //  // here we can either return true or false
  //  // depending on if we want to leave this view
  //  if(this.canLeave){
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }



}
