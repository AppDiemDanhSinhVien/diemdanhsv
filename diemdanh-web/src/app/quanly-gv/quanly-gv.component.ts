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
    "lop": ""
  };
  Class;
  constructor(private auth: AuthService) {
    this.userLoggedIn =JSON.parse(this.auth.getToken());
  }

  ngOnInit() {
    this.GiaoVien=this.auth.GV;
  }
  addGV(){
    this.auth.addGV(this.newteacher);
  }
  editGV(data){
    this.info_edit= data;
    this.edit= true;
    console.log(this.info_edit)
  }
  delete(data){
    this.auth.delete(data.key)
  }
  updateGV(){
    this.auth.updateGV(this.info_edit.key, this.info_edit);
    let keylop=this.auth.Class.find(s => s.tenlop=== this.info_edit.lop)
    this.auth.updateClass(keylop.key, {"tengv": this.info_edit.tengv});
  }
}
