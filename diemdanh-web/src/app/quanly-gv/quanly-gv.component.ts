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
  constructor(private auth: AuthService) {
    this.userLoggedIn =JSON.parse(this.auth.getToken());
  }

  ngOnInit() {
    this.GiaoVien=this.auth.GV;
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
    // console.log(this.info_edit.lop)
  }
  addGV(){
    this.auth.addGV(this.newteacher);
  }
  editGV(data){
    this.info_edit= data;
    this.info_edit.lop=[];
    this.edit= true;
    console.log(this.info_edit)
  }
  delete(data){
    this.auth.delete(data.key)
  }
  updateGV(){
    this.auth.updateGV(this.info_edit.key, this.info_edit);
    // get list key of class in this teacher
    var datas = new Array();
    for(let i=0; i< this.info_edit.lop.length; i++){
      datas.push(this.info_edit.lop[i].key);
    }
    console.log(datas); // => console list key
    // update name of teacher in class list
    for(let i=0; i< datas.length; i++){
      this.auth.updateClass(datas[i], {"tengv": this.info_edit.tengv})
    }
  }
}
