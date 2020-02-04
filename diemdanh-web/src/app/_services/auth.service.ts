import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  UsersRef: AngularFireList < any > = null;
  GVRef: AngularFireList < any > = null;
  ClassRef: AngularFireObject<any>;
  GV;
  Class;
  currentUser:any;
  returnUrl: string;
  constructor(private router: Router,private db: AngularFireDatabase, private route: ActivatedRoute) {
    // get url query
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.getGV();
    this.getClass();
   }
   getGV(){
    this.GVRef = this.db.list('GV');
    this.GVRef.snapshotChanges()
    .pipe(map(items => { // <== new way of chaining
        return items.map(a => {
            const data = a.payload.val();
            const key = a.payload.key;
            return {
                key, ...data
            }; // or {key, ...data} in case data is Obj
        });
    })).subscribe(gv =>{
      this.GV= gv;
    });
  }
  getClass(){
    // this.ClassRef= this.db.object('LOP');
    // this.ClassRef.snapshotChanges().pipe(map(item =>{
    //   const data = item.payload.val();
    //   const key = item.key;
    //   // return {
    //   //   key, ...data
    //   // };
    //   return data
    // })).subscribe(data=>{
    //   this.Class= data;
    //   // this.Class=Object.keys(data).map(key => data[key]);
    //   console.log("covert"+Object.keys(data).map(key => data[key]))
    //   console.log("data: "+data);
    // })
    this.db.list('LOP').valueChanges().subscribe(lop => {
      this.Class= lop;
      console.log(this.Class);
    });
  }
   addGV(newdata){
    this.GVRef = this.db.list('GV');
    this.GVRef.push(newdata);
    console.log('added');
   }
   updateGV(key, data){
    this.db.list('GV').update(key, data);
    console.log("updated");
   }
   delete(data){
     this.db.list('GV').remove(data);
     console.log("removed")
   }
   updateClass(key, data){
    this.db.list('LOP').update(key, data);
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
