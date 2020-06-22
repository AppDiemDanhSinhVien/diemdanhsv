import { Component, OnInit } from '@angular/core';
import {AuthService} from '../_services/auth.service';
// import { $ } from 'protractor';

declare var $: any;

@Component({
  selector: 'app-quanly-sinhvien',
  templateUrl: './quanly-sinhvien.component.html',
  styleUrls: ['./quanly-sinhvien.component.css']
})
export class QuanlySinhvienComponent implements OnInit {
  userLoggedIn
  p: number = 1;
  // collection: any[] = someArrayOfThings; 
  Student
  hocSinhMoi={
    "email": "",
    "lop": "",
    "mssv": "",
    "ngaysinh": "",
    "password": "",
    "tensv": "",
  }
  data: any  = null    
  bata: any = null
  class                                                             
  Classes
  num

  constructor(private auth: AuthService) {
    this.userLoggedIn =JSON.parse(this.auth.getToken());
   }

  ngOnInit() {
    this.Student = this.auth.Student
  }
  // Them SV moi
  addStudent(cc){
    let id = this.auth.StudentRef.push(cc).key;
    this.auth.StudentRef.update(id, {id: id})
    console.log('coconut puzzy')
    $('#newStudent').modal('toggle')
  }
  // Chinh sua thong tin SV + binding data
  editStudent(cc){
    this.data = cc;
  }
  // Cap nhat thong tin SV
  updateStudent(key, cc){
    this.auth.StudentRef.update(key, cc);
    $('#editStudent').modal('toggle')
    // document.getElementById("editStudent").setAttribute('hidden','true');
  }
  //  Lay cac lop ma SV da dang ky
  addClass(cc){
    this.bata = cc
    this.Classes = this.bata.lop
    if(this.Classes == ""){
      this.Classes = []
    }
  }
  // Loc ra cac lop chua dang ky
  filterUnregistered(){
    let cc = this.Classes
    let cl = this.auth.Class
    let cccl = []
    for(let i of cl){
      let x = 0
      for(let o of cc){
        if (i.tenlop == o.IDLop){x+=1; break}
      }
      if(x==0)cccl.push(i)
    }
    return cccl
  }
  // Them lop cho SV
  updateClass(cc){
    let tenLop
    for(let o of this.auth.Class){
      if(o.key == this.class){tenLop = o.tenlop}
    }
    let lop = {IDLop: tenLop,key :this.class,diemdanh:{di:0,vang:0}}
    this.Classes.push(lop)
    this.auth.StudentRef.update(cc,{"lop":this.Classes}) 
  }
  // Xoa lop SV
  deleteClass(x, y, cc){
    if(confirm('Delete ' + x + " subject")){
      const arr = []
      for(let o of y){
        if(o.IDLop != x){
          arr.push(o)
        }
      }
      console.log(arr)
      this.auth.StudentRef.update(cc,{"lop":arr}) 
    }
    else{}
  }
  // Hoi truoc khi xoa SV
  beforeDelete(cc, studentKey){
    if (confirm("Delete student " + cc)) {
      this.deleteStudent(studentKey)
    } else{}
  }
  // Xoa SV ra khoi database
  deleteStudent(studentKey){
    console.log("c u agajn")
    this.auth.StudentRef.remove(studentKey)
  }
}
