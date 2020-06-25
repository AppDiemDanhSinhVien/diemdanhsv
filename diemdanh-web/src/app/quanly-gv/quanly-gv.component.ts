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
  modal_stt= true; // <= trạng thái modal (Add new GV)
  monhoc; // <== tất cả môn học
  noTeacher: []; // <= lớp không có GV
  newteacher={
    "email": "",
    "password": "",
    "msgv": "",
    "tengv": "",
    "ngaysinh": "",
    "mon": []
  }; // <= data khi thêm giáo viên
  class_edit; // <= lớp đang chỉnh sửa
  constructor(private auth: AuthService) {
    this.userLoggedIn =this.auth.currentUserValue();
    this.GiaoVien=this.auth.GV;
    // this.monhoc= this.auth.MonHoc;
  }

  ngOnInit() {

    this.GiaoVien=this.auth.GV;

  }
   checkClass(item){
     if( this.auth.Class.find(a => a.key === item.key)){
      return true;
    }else{
      return false;
    }

    this.noTeacher= this.auth.ClassNoHaveTeacher();
    this.monhoc= this.auth.MonHoc;


  // =======
    this.noTeacher= this.auth.ClassNoHaveTeacher();
    this.monhoc= this.auth.MonHoc;
  // >>>>>>> b1b298bcee34e7d4bd46182e60e27b6bbc5e6d87
  }

  // function when edit class of GV when add new GV
  onChange(checked, item){
    if(checked){
      this.newteacher.mon.push(item);
      console.log(this.newteacher.mon);
    }else{
      this.newteacher.mon.splice(this.newteacher.mon.indexOf(item) , 1)
      console.log(this.newteacher.mon);
    }
  }

  // function when edit class of GV when edit GV
  onChangeEdit(checked, item){
    if(checked){
      this.edit_on.mon.push(item);
      console.log(this.edit_on.mon);
    } else {
      this.edit_on.mon.splice(this.edit_on.mon.indexOf(item), 1);
      console.log(this.edit_on.mon);
    }
  }

  // function when click button add new GV
  async addGV(){
    // update tab MonHoc
    await this.newteacher.mon.forEach(e => {
      this.auth.updateMon(e.id, {"tengv" : this.newteacher.tengv})
    });

    // update tab GV
    await this.auth.addGV(this.newteacher);

    // hidden modal (add new GV)
    await this.hiddenModal('close_add_modal');

    // set info = null
    this.newteacher= {
      "email": null,
      "password": null,
      "msgv": null,
      "tengv": null,
      "ngaysinh": null,
      "mon": []
    };

    this.noTeacher= await this.auth.ClassNoHaveTeacher();
  }

  // function update info GV
  async updateGV(){
    // update tab GV
    await this.auth.updateGV(this.edit_on.id, this.edit_on);

    // get all id of monhoc in tab GV
    await this.auth.getGV();
    let tabGV=[];
    await this.auth.GV.forEach(gv => {
      gv.mon.forEach(mon => {
        tabGV.push(mon.id)
      });
    });
    console.log("all id of monhoc in tab GV: ");
    console.log(tabGV);

    // update name of teacher in tab MonHoC
    if(this.edit_on.mon != null){
      for(let i=0; i< this.edit_on.mon.length; i++){
        this.auth.updateMon(this.edit_on.mon[i].id, {"tengv": this.edit_on.tengv});
      }
    }

    // get all id of monhoc in tab MonHoc
    let tabMonHoc=[];
    for(let i=0; i< this.auth.MonHoc.length; i++){
      await tabMonHoc.push(this.auth.MonHoc[i].id);
    }
    await console.log("all id of monhoc in tab LOP: ");
    await console.log(tabMonHoc);

    // filter id of monhoc no have teacher
    let result= tabMonHoc;
    await tabGV.forEach(e => {
      if(tabMonHoc.indexOf(e) > -1){
        result.splice(tabMonHoc.indexOf(e), 1);
      }
    })
    await console.log("all key of class no have teacher: ");
    await console.log(result);

    // update tab MonHoc when have non teacher in class
    await result.forEach(p => {
      this.auth.updateMon(p, {tengv: ""})
    });

    this.noTeacher= await this.auth.ClassNoHaveTeacher();

    // hidden modal (add new GV)
    await this.hiddenModal('close_edit_modal');
  }

  // function when click edit GV
  async editGV(data){
    console.log(data);
    this.edit= await true; // bật trạng thái đang chỉnh sửa
    this.edit_on= await data; // đổ dữ liệu
    if(this.edit_on.mon){
      this.class_edit= await this.edit_on.mon;
    }else{
      this.edit_on.mon= await [];
      this.class_edit= await [];
    }
    let k= await this.auth.ClassNoHaveTeacher(); //list những lớp chưa có giáo viên
    if(this.class_edit.length == 0){
      this.class_edit= await this.auth.ClassNoHaveTeacher();
      await console.log(this.class_edit);
    }else{
      this.class_edit= await this.class_edit.concat(k);
      await console.log(this.class_edit);
    }
  }

  // Class no have teacher + this class
  ClassNoHaveTeacher(){
    this.noTeacher= this.auth.ClassNoHaveTeacher();
    return this.auth.ClassNoHaveTeacher();
  }

  // Class have teacher
  ClassHaveTeacher(){
    return this.auth.ClassHaveTeacher();
  }

  // Remote GV
  async delete(data){
    await data.mon.forEach(e => {
      this.auth.updateMon(e.id, {tengv: ""})
    });
    await console.log(data.id);
    await this.auth.delete(data.id);
    this.noTeacher= await this.auth.ClassNoHaveTeacher();
  }

  // function hidden modal (enter id of button close);
  hiddenModal(id){
    let elem = document.getElementById(id);
    let evt = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
    elem.dispatchEvent(evt);
  }
}
