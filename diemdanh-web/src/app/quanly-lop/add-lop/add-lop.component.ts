import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {  FormBuilder, Validators, FormGroup, ReactiveFormsModule }from "@angular/forms";
import {Lop} from '../lop';
declare var $:any;
@Component({
  selector: 'app-add-lop',
  templateUrl: './add-lop.component.html',
  styleUrls: ['./add-lop.component.css']
})
export class AddLopComponent implements OnInit {
  addForm: FormGroup;
  LoiLichDay = false;
  GiaoVien: any;
  lop: Lop = new Lop;
  schedule = {
    thuday: null,
    gioday: {giobd: null, giokt: null}
  };
  editSchedule = {
    thuday: null,
    gioday: {giobd: null, giokt: null}
  };
  lichDay = [];
  index = -1;
  constructor(public db: AngularFireDatabase, private formBuilder: FormBuilder) {
   db.list('GV').valueChanges().subscribe(gv => this.GiaoVien = gv);
  }

  ngOnInit() {
    $('.toast').toast({
      delay: 3000,
      autohide: true
    });
    this.addForm = this.formBuilder.group({
      TenLop: ['', Validators.required],
      NgayBatDau: ['', Validators.required],
      ChonGiaoVien: ['', Validators.required],
    });


  }
  get addF() {
    return this.addForm.controls;
  }
  themNgay(){
    if(this.schedule.thuday == null || this.schedule.gioday.giobd == null || this.schedule.gioday.giokt == null ){
      alert('Lỗi! Hãy nhập đầy đủ thông tin')
    }else{
      this.lichDay.push(this.schedule);
      this.schedule = {
        thuday: null,
        gioday: {giobd: null, giokt: null}
    }
    }

  }
  removeLich(i){
    var result = confirm('are you sure remove this ?');
    if(result) {
      this.lichDay.splice(i, 1);
    }

  }
  editLich(i){
    $('#editSchedule').modal('show');
    this.index = i;
    this.editSchedule = this.lichDay[i];
  }
  updateSchedule(index) {
    $('#editSchedule').modal('hide');
    this.lichDay[index] = this.editSchedule;

  }
  hideInvalid() {
    this.LoiLichDay = false;
  }
  onSubmit(){
    if( this.lichDay.length == 0 ) {
      this.LoiLichDay = true;
      alert('Tạo thất bại. Hãy nhập đầy đủ thông tin!');
    }else{
     if (this.addForm.valid ) {
       this.lop.tenlop = this.addForm.get('TenLop').value;
       this.lop.tengv = this.addForm.get('ChonGiaoVien').value;
       this.lop.ngaybatdau = this.addForm.get('NgayBatDau').value;
       this.lop.lichday = this.lichDay;
       const itemsRef = this.db.list('LOP');
        itemsRef.push(this.lop);
        this.lop = new Lop;
       // this.lichDay = [];
        this.addForm.reset;
      $('.toast').toast('show');
      } else alert('Tạo thất bại. Hãy nhập đầy đủ thông tin!');
     }
  }
}
