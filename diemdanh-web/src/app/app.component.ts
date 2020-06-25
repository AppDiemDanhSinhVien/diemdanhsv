import { Component, OnInit } from '@angular/core';
import {AuthService} from './_services/auth.service';

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'diemdanh-web';
  loggedIn = false;
  userLoggedIn: any;
  constructor(public auth: AuthService ) {
    this.userLoggedIn = this.auth.currentUserValue()//JSON.parse(this.auth.getToken());
    if(this.auth.isLoggedIn()) {
      this.loggedIn = true;
    }
   }

  menuToggle() {
    $("#wrapper").toggleClass("toggled");

  }
  logout() {
    this.loggedIn = false;
    this.auth.logout();
    this.userLoggedIn = this.auth.currentUserValue();
  }
}
