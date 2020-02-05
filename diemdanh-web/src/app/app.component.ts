import { Component } from '@angular/core';
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
      this.userLoggedIn = JSON.parse(this.auth.getToken()) || this.auth.currentUser;
      console.log(this.userLoggedIn);
      if( this.userLoggedIn) {
        this.loggedIn = true;
      }
   }

   ngOnInit() {
    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });
  }
  logout() {
    this.loggedIn = false;
    this.auth.logout();
    this.userLoggedIn = this.auth.getToken();
  }
}
