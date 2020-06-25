import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  UsersRef: AngularFireList<any> = null;
  GVRef: AngularFireList<any> = null;
  ClassRef: AngularFireObject<any>;
  MonRef: AngularFireObject<any> = null;
  StudentRef: AngularFireList<any>
  GV; // <= tất cả giáo viên
  Class; // <= tất cả các lớp
  YClass; // <= lớp chưa có giáo viên
  Student; // <= tất cả học sinh
  MonHoc; // <= tất cả môn
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  constructor(private router: Router, private db: AngularFireDatabase, private route: ActivatedRoute) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.currentUserValue()
    // get url query
    this.getGV();
    this.getMon();
    this.getClass();
    this.getStudent();
  }
  getGV() {
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
      })).subscribe(gv => {
        this.GV = gv;
      });
  }
  getClass() {
    let classRef: AngularFireList<any> = this.db.list('LOP');
    classRef.snapshotChanges()
      .pipe(map(items => { // <== new way of chaining
        return items.map(a => {
          const data = a.payload.val();
          const key = a.payload.key;
          return {
            key, ...data
          }; // or {key, ...data} in case data is Obj
        });
      })).subscribe(lop => {
        this.Class = lop;
        // console.log(lop)
        this.YClass = lop.filter(z => !z.tengv);
      });
  }
  getStudent() {
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
      })).subscribe(cc => {
        this.Student = cc
        // console.log(this.Student)
      })
  }
  // get all Mon
  getMon() {
    let MonRef: AngularFireList<any> = this.db.list('MonHoc');
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
        this.MonHoc = mon;
      });
  }
  // Class no have teacher + this class
  ClassNoHaveTeacher() {
    let result = this.MonHoc.filter(m => m.tengv == null || m.tengv == '');
    let rt = result.map(data => {
      return {
        id: data.id,
        lichday: data.lichday,
        tenmonhoc: data.tenmonhoc
      }
    });
    return rt;
  }
  // Class have teacher
  ClassHaveTeacher() {
    let result = this.MonHoc.filter(m => m.tengv != null);
    let rt = result.map(data => {
      return {
        id: data.id,
        lichday: data.lichday,
        tenmonhoc: data.tenmonhoc
      }
    });
    return rt;
  }
  // Add new teacher
  async addGV(newdata) {
    this.GVRef = this.db.list('GV');
    await this.GVRef.push(newdata);
    await console.log('Add Giao Vien Complete');
    await this.getGV();
    await this.ClassNoHaveTeacher();
  }

  // Update info teacher
  async updateGV(key, data) {
    await this.db.list('GV').update(key, data);
    await console.log("update Giao Vien Complete");
    await this.ClassNoHaveTeacher();
  }

  // Delete data teacher
  async delete(id) {
    await this.db.list('GV').remove(id);
    await console.log("removed Giao Vien Complete");
    await this.ClassNoHaveTeacher();
  }

  // Update info in tab MonHoc
  async updateMon(key, data) {
    await this.db.list('MonHoc').update(key, data);
    await console.log("updated Mon Hoc Complete")
    await this.ClassNoHaveTeacher();
  }
  sendToken(email, password) {
    this.UsersRef = this.db.list('root');
    return new Promise((resolve, reject) => {
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
          let userLogin = user.find(u => u.email === email && u.password === password);
          if (userLogin) {
            localStorage.setItem('currentUser', JSON.stringify(userLogin));
            this.currentUserSubject.next(userLogin);
            resolve({logged: true, User: userLogin});
          }else{
            reject({logged: false})
          }
        });
    })

  }
  currentUserValue() {
    return this.currentUserSubject.value;
  }
  isLoggedIn() {
   let user = this.currentUserValue();
   if(user) return true;
   return false;
  }
  logout() {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
    this.router.navigate(["login"]);
  }
}
