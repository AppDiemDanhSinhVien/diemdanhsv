import { Component, OnInit } from '@angular/core';
import {AuthService} from '../_services/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userLoggedIn: any;
  items: Observable<any[]>;
  constructor(private auth: AuthService, db: AngularFireDatabase ) {
    this.userLoggedIn =JSON.parse(this.auth.getToken());
    db.list('LOP').valueChanges().subscribe(lop => console.log(lop));
      console.log(this.userLoggedIn);
   }

  ngOnInit() {
    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });
  }
  logout() {
    this.auth.logout();
    this.userLoggedIn = this.auth.getToken();
  }
}
