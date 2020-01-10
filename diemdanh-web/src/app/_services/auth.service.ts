import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import {  map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  UsersRef: AngularFireList < any > = null;
  currentUser:any;
  returnUrl: string;
  constructor(private router: Router,private db: AngularFireDatabase, private route: ActivatedRoute) {
    // get url query
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
   }
  sendToken(email, password) {
    this.UsersRef = this.db.list('root');
    this.UsersRef.snapshotChanges()
    .pipe(map(items => { // <== new way of chaining
        return items.map(a => {
            const data = a.payload.val();
            const key = a.payload.key;
            return {
                key, ...data
            }; // or {key, ...data} in case data is Obj
        });
    })).subscribe(user => {
      this.currentUser =  user.find(u => u.email === email && u.password === password);
      if(this.currentUser) {
        localStorage.setItem("LoggedInUser",JSON.stringify(this.currentUser));
        this.router.navigate([this.returnUrl]);
      }
    });
  }
  getToken() {
    return localStorage.getItem("LoggedInUser")
  }
  isLoggedIn() {
    return this.getToken() !== null;
  }
  logout() {
    localStorage.removeItem("LoggedInUser");
    this.router.navigate(["signin"]);
  }
}
