import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  UsersRef: AngularFireList < any > = null;
  GVRef: AngularFireList < any > = null;
  ClassRef: AngularFireObject<any>;
  MonRef: AngularFireObject<any> = null;
  StudentRef: AngularFireList<any>
  GV; // <= tất cả giáo viên
  Class; // <= tất cả các lớp
  YClass; // <= lớp chưa có giáo viên
  Student; // <= tất cả học sinh
  MonHoc; // <= tất cả môn
  currentUser:any;
  returnUrl: string;
  constructor(private router: Router,private db: AngularFireDatabase, private route: ActivatedRoute) {
    // get url query
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.getGV();
    this.getMon();
    this.getClass();
    this.getStudent();
  }
  getGV(){
    this.GVRef = this.db.list('GV');
    this.GVRef.snapshotChanges()
    .pipe(map(items => { // <== new way of chaining
        return items.map(a => {
            const data = a.payload.val();
            const id = a.payload.key;
            return {
                id, ...data
            }; // or {key, ...data} in case data is Obj
        });
    })).subscribe(gv =>{
      this.GV= gv;
      console.log("All teacher: ")
      console.log(gv);
    });
  }
  getClass(){
    let classRef: AngularFireList < any > =  this.db.list('LOP');
    classRef.snapshotChanges()
    .pipe(map(items => { // <== new way of chaining
        return items.map(a => {
            const data = a.payload.val();
            const key = a.payload.key;
            return {
                key, ...data
            }; // or {key, ...data} in case data is Obj
        });
    })).subscribe(lop =>{
      this.Class= lop;
      // console.log(lop)
      this.YClass=lop.filter(z => !z.tengv);
    });
  }
  getStudent(){
    this.StudentRef = this.db.list('SV')
    this.StudentRef.snapshotChanges()
    .pipe(map(items => { // <== new way of chaining
        return items.map(a => {
            const data = a.payload.val();
            const key = a.payload.key;
            return {
                key, ...data
            }; // or {key, ...data} in case data is Obj
        });
    })).subscribe(cc =>{
      this.Student= cc
      // console.log(this.Student)
  })}
  // get all Mon
  getMon(){
    let MonRef: AngularFireList < any > =  this.db.list('MonHoc');
    MonRef.snapshotChanges()
    .pipe(map(items => { // <== new way of chaining
        return items.map(a => {
            const data = a.payload.val();
            const id = a.payload.key;
            return {
                id, ...data
            }; // or {key, ...data} in case data is Obj
        });
    })).subscribe(mon => {
      this.MonHoc= mon;
    });
  }
  // Class no have teacher + this class
  ClassNoHaveTeacher(){
    let result=this.MonHoc.filter(m => m.tengv == null || m.tengv == '');
    let rt= result.map(data => {
      return {
        id : data.id,
        lichday: data.lichday,
        tenmonhoc: data.tenmonhoc
      }
    });
    return rt;
  }
  // Class have teacher
  ClassHaveTeacher(){
    let result= this.MonHoc.filter(m => m.tengv != null);
    let rt= result.map(data => {
      return {
        id : data.id,
        lichday: data.lichday,
        tenmonhoc: data.tenmonhoc
      }
    });
    return rt;
  }
  // Add new teacher
  async addGV(newdata){
    this.GVRef = this.db.list('GV');
    await this.GVRef.push(newdata);
    await console.log('added');
    await this.getGV();
    await this.ClassNoHaveTeacher();
  }

  // Update info teacher
  async updateGV(key, data){
    await this.db.list('GV').update(key, data);
    await console.log("updated");
    await this.ClassNoHaveTeacher();
  }

  // Delete data teacher
  async delete(id){
    await this.db.list('GV').remove(id);
    await console.log("removed");
    await this.ClassNoHaveTeacher();
  }

  // Update info in tab MonHoc
  async updateMon(key, data){
    await this.db.list('MonHoc').update(key, data);
    await console.log("updated MonHoc")
    await this.ClassNoHaveTeacher();
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
