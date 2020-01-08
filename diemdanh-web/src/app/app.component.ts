import { Component } from '@angular/core';
import {  Router } from '@angular/router';
import { Location} from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'diemdanh-web';
  isSignIn = true;
  constructor(private router: Router, private location:Location) {
    if (!this.isSignIn) {
      this.location.replaceState('/'); // clears browser history so they can't navigate with back button
      this.router.navigate(['/signin']);
    }

  }
}
