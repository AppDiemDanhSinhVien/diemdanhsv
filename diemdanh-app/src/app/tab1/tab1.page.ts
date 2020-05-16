import { Component } from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  User:any;
  constructor(private localNotifications: LocalNotifications, private authService: AuthenticationService) {
  
  }
  // function nay se run khi show component nay
  ionViewWillEnter() {
    this.authService.getUserCurrent().then((val) => {
      if(val) {
       return this.User = val;
      }
    });
  }
 
  registerLocalNotification(ms: number){
    this.localNotifications.schedule({
      title: 'My ${ms} notification',
      text: 'Thats pretty easy...',
       foreground: true
    });
  }
  
}
