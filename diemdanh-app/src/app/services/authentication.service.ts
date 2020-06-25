import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import 'firebase/database';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  UsersRef: AngularFireList < any > = null;
  currentUser: any;
  authenticationState = new BehaviorSubject(false);

  constructor(private db: AngularFireDatabase, public router: Router, private storage: Storage) {
      this.checkLogged();
      
  }
    login(email, password){

    this.UsersRef = this.db.list('SV');
    return  new Promise((resolve, reject) => {
        this.UsersRef.snapshotChanges()
             .pipe(map(items => { // <== new way of chaining
                 return items.map(a => {
                     const data = a.payload.val();
                     const key = a.payload.key;
                     return {
                         key, ...data
                     }; // or {key, ...data} in case data is Obj
                 });
             })).subscribe(users => {
                 
                 this.currentUser = users.find(u => u.email === email && u.password === password);
                 if (this.currentUser ) {
                        localStorage.setItem('Logged', 'true');
                        this.storage.set('LoggedInUser', this.currentUser).then(() => {
                        this.authenticationState.next(true);
                        this.router.navigate(['/']);
                    });
                    resolve(this.currentUser);
                  } else {             
                    reject(new Error("It broke"));
                  }             
             });
       
      });
  }
  checkLogged() {
      let logged = localStorage.getItem('Logged');
      if (logged) {
          this.authenticationState.next(true);
      }
  }
  isAuthenticated() {
      return this.authenticationState.value;
  }
  getUserCurrent() {
      return this.storage.get("LoggedInUser");
  }
  logout() {
      localStorage.removeItem('Logged');
      this.storage.remove('LoggedInUser').then(() => {
          this.authenticationState.next(false);
          //location.reload();
          this.router.navigate(["/login"]);

      });
  }

  updateInfor(key) {
      this.UsersRef = this.db.list('SV');
      let checkUser;
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
              checkUser = user.find(u => u.key === key);
          });
      setTimeout(() => {
          if (checkUser) {
              localStorage.setItem('Logged', 'true');
              this.storage.set('LoggedInUser', checkUser);
          }
      }, 5000);

  }

}
