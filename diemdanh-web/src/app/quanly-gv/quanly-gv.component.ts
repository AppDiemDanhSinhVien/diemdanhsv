import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-quanly-gv',
  templateUrl: './quanly-gv.component.html',
  styleUrls: ['./quanly-gv.component.css']
})
export class QuanlyGVComponent implements OnInit {
  userLoggedIn;
  GiaoVien; // <= danh sách giáo viên
  edit= false; // <= trạng thái edit
  edit_on; // <= data khi chỉnh sửa
  newteacher={
    "email": "",
    "password": "",
    "msgv": "",
    "tengv": "",
    "ngaysinh": "",
    "lop": []
  }; // <= data khi thêm giáo viên
  classes; // <= data giáo viên chưa có lớp dạy
  class_edit; // <= lớp đang chính sửa
  constructor(private auth: AuthService) {
    this.userLoggedIn =JSON.parse(this.auth.getToken());
    this.GiaoVien=this.auth.GV;
  }

  ngOnInit() {

  }
  // function when add new teacher (don't used)
  async addnew(){
    let cls= this.auth.Class;
    let result=[];
    await cls.forEach(e => {
      if(e.tengv == null || e.tengv == ''){
        result.push(e);
      }
    })
    this.classes= result;
    console.log(this.classes);
  }

  // function check class of no have teacher (don't used)
  checkClass(item){
    if(this.auth.YClass.find(a => a.key === item.key)){
      return true;
    }else{
      return false;
    }
  }
  // function when edit class of GV when add new GV
  onChange(checked, item){
    if(checked){
    this.newteacher.lop.push(item);
    } else {
      this.newteacher.lop.splice(this.newteacher.lop.indexOf(item), 1)
    }
    // console.log(this.newteacher.lop)
  }

  // function when edit class of GV when edit GV
  onChangeEdit(checked, item){
    if(checked){
      this.edit_on.lop.push(item);
    } else {
      this.edit_on.lop.splice(this.edit_on.lop.indexOf(item), 1)
    }
    console.log("Danh sách lớp có thể chọn: ");
    console.log(this.ClassNoHaveTeacher());
  }
  // function when click button add new GV
  async addGV(){
    await this.auth.addGV(this.newteacher);
    this.newteacher={
      "email": "",
      "password": "",
      "msgv": "",
      "tengv": "",
      "ngaysinh": "",
      "lop": []
    };
    await this.ClassHaveTeacher();
    await this.ClassNoHaveTeacher();
  }
  // function when click edit GV
   editGV(data){
    this.edit_on= data;
    this.edit= true;
    var k= this.auth.ClassNoHaveTeacher();
    this.class_edit=this.edit_on.lop.concat(k);
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
    let x= false;
    if(this.edit_on.lop != null){
      for(let i=0; i< this.edit_on.lop.length; i++){
        if(this.edit_on.lop[i].key === keys){
          x= true;
          break;
        }else{
          x=false;
          break;
        }
      }
      return x;
    }
  }
  
  // Class no have teacher + this class
  ClassNoHaveTeacher(){
    return this.auth.ClassNoHaveTeacher();
  }

  // Class have teacher
  ClassHaveTeacher(){
    return this.auth.ClassHaveTeacher();
  }

  delete(data){
    this.auth.delete(data.key)
  }
  async updateGV(){
    if(this.edit_on.lop != null){
      // update name of teacher in tab LOP
      for(let i=0; i< this.edit_on.lop.length; i++){
        this.auth.updateClass(this.edit_on.lop[i].key, {"tengv": this.edit_on.tengv});
      }
    }else{
    }

    // update tab GV
    await this.auth.updateGV(this.edit_on.key, this.edit_on);

    // get all key of class in tab LOP
    let lop=[];
    for(let i=0; i< this.auth.Class.length; i++){
      await lop.push(this.auth.Class[i].key);
    }
    console.log("all key of class in tab LOP: "+ lop);

    // get all key of class in tab GV
    this.auth.getGV();
    let cls=[];
    await this.auth.GV.forEach(e => {
      e.lop.forEach(h => {
        cls.push(h.key)
      });
    });
    console.log("all key of class in tab GV: "+cls);

    // filter key of class non have teacher
    await cls.forEach(e => {
      if(lop.indexOf(e) > -1){
        lop.splice(lop.indexOf(e), 1);
      }
    })
    console.log("all key of class no have teacher: "+ lop);

    // update tab LOP when have non teacher in class
    for(let i=0; i< lop.length; i++){
      await this.auth.updateClass(lop[i], {tengv: null});
    }

    await this.ClassNoHaveTeacher();
    await this.ClassHaveTeacher();
  }
}
