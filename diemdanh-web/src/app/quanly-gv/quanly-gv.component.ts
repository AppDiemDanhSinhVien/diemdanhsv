import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-quanly-gv',
  templateUrl: './quanly-gv.component.html',
  styleUrls: ['./quanly-gv.component.css']
})
export class QuanlyGVComponent implements OnInit {
  userLoggedIn;
  GiaoVien;
  edit= false;
  info_edit: any;
  newteacher={
    "email": "",
    "password": "",
    "msgv": "",
    "tengv": "",
    "ngaysinh": "",
    "lop": []
  };
  Class;
  lop=[];
  classes;
  constructor(private auth: AuthService) {
    this.userLoggedIn =JSON.parse(this.auth.getToken());
  }

  ngOnInit() {
    this.GiaoVien=this.auth.GV;
    
  }
  checkClass(item){
    if(this.auth.YClass.find(a => a.key === item.key)){
      return true;
    }else{
      return false;
    }
  }
  onChange(checked, item){
    if(checked){
    this.newteacher.lop.push(item);
    } else {
      this.newteacher.lop.splice(this.newteacher.lop.indexOf(item), 1)
    }
    // console.log(this.newteacher.lop)
  }
  onChangeEdit(checked, item){
    if(checked){
      this.info_edit.lop.push(item);
    } else {
      this.info_edit.lop.splice(this.info_edit.lop.indexOf(item), 1)
    }
    console.log(this.info_edit.lop);
  }
  addGV(){
    this.auth.addGV(this.newteacher);
  }
  editGV(data){
    this.info_edit= data;
    this.edit= true;
    console.log("Danh sách lớp của giáo viên đang chỉnh sửa: ");
    console.log(this.info_edit.lop);
    console.log("Danh sách gồm lớp chưa có giáo viên và lớp của giáo viên đang chỉnh sửa: ");
    console.log(this.ClassNoHaveTeacher());
    console.log("Danh sách lớp đã có giáo viên dạy: ");
    console.log(this.ClassHaveTeacher());
  }
  // check disable when is class have teacher
  isDisabled(item){
    if(this.ClassNoHaveTeacher().indexOf(item) == -1){
      return true;
    }else{
      return false;
    }
  }
  // checked when teacher teaching this class
  isChecked(keys){
    let x: Boolean;
    for(let i=0; i< this.info_edit.lop.length; i++){
      if(this.info_edit.lop[i].key === keys){
        x= true;
        break;
      }else{
        x=false;
        break;
      }
    }
    return x;
  }
  // Class no have teacher + this class
  ClassNoHaveTeacher(){
    let cls= this.auth.Class;
    let result=[];
    cls.forEach(e => {
      if(e.tengv == null || e.tengv == '' || e.tengv === this.info_edit.tengv){
        result.push(e);
      }
    })
    // console.log(result);
    return result;
  }
  // Class have teacher
  ClassHaveTeacher(){
    let cls= this.auth.Class;
    let result=[];
    cls.forEach(e => {
      if(e.tengv != null){
        result.push(e);
      }
    })
    // console.log(result);
    return result;
  }
  delete(data){
    this.auth.delete(data.key)
  }
  async updateGV(){
    // update name of teacher in tab LOP
    for(let i=0; i< this.info_edit.lop.length; i++){
      this.auth.updateClass(this.info_edit.lop[i].key, {"tengv": this.info_edit.tengv});
    }

    // update tab GV
    await this.auth.updateGV(this.info_edit.key, this.info_edit);

    // get all key of class in tab LOP
    let lop=[];
    for(let i=0; i< this.auth.Class.length; i++){
      await lop.push(this.auth.Class[i].key);
    }
    console.log(lop);

    // get all key of class in tab GV
    this.auth.getGV();
    let cls=[];
    await this.auth.GV.forEach(e => {
      e.lop.forEach(h => {
        cls.push(h.key)
      });
    });
    console.log(cls);

    // filter key of class non have teacher
    await cls.forEach(e => {
      if(lop.indexOf(e) > -1){
        lop.splice(lop.indexOf(e), 1);
      }
    })
    console.log(lop);

    // update tab LOP when have non teacher in class
    for(let i=0; i< lop.length; i++){
      await this.auth.updateClass(lop[i], {tengv: null});
    }
  }
}
