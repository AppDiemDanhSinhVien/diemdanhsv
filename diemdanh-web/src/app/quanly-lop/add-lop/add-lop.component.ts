import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MonHoc } from '../monhoc';
declare var $: any;
@Component({
  selector: 'app-add-lop',
  templateUrl: './add-lop.component.html',
  styleUrls: ['./add-lop.component.css']
})
export class AddLopComponent implements OnInit {
  addForm: FormGroup;
  LoiLichDay = false;
  GiaoVien: any;
  Monhoc: MonHoc = new MonHoc;
  schedule = {
    thuday: null,
    gioday: { giobd: null, giokt: null }
  };
  editSchedule = {
    thuday: null,
    gioday: { giobd: null, giokt: null }
  };
  lichDay = [];
  index = -1;
  isAdding = false;
  constructor(public db: AngularFireDatabase, private formBuilder: FormBuilder) {
    db.list('GV').valueChanges().subscribe(gv => this.GiaoVien = gv);
  }

  ngOnInit() {
    $('.toast').toast({
      delay: 3000,
      autohide: true
    });
    this.addForm = this.formBuilder.group({
      TenMonHoc: ['', Validators.required],
      NgayBatDau: ['', Validators.required],
      ChonGiaoVien: [''],
      SoBuoiHoc: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
    });


  }
  get addF() {
    return this.addForm.controls;
  }
  themNgay() {
    if (this.schedule.thuday == null || this.schedule.gioday.giobd == null || this.schedule.gioday.giokt == null) {
      alert('Lỗi! Hãy nhập đầy đủ thông tin')
    } else {
      this.lichDay.push(this.schedule);
    }

  }
  removeLich(i) {
    var result = confirm('are you sure remove this ?');
    if (result) {
      this.lichDay.splice(i, 1);
    }

  }
  editLich(i) {
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
  // Tạo lớp mới
  onSubmit() {

    if (this.lichDay.length == 0) {
      this.LoiLichDay = true;
      alert('Thêm thất bại. Hãy nhập đầy đủ thông tin!');
    } else {
      if (this.addForm.valid) {
        this.isAdding = true;
        this.Monhoc.tenmonhoc = this.addForm.get('TenMonHoc').value;
        this.Monhoc.tengv = this.addForm.get('ChonGiaoVien').value;
        this.Monhoc.ngaybatdau = this.addForm.get('NgayBatDau').value;
        this.Monhoc.sobuoihoc = this.addForm.get('SoBuoiHoc').value;
        this.Monhoc.lichday = this.schedule;

       this.themMonHoc().then(() => {
        this.Monhoc = new MonHoc;
        this.addForm.reset;
        this.isAdding = false;
        $('.toast').toast('show');
        $('.toast-body').text('add success!')
       }).catch(err => {
        $('.toast').toast('show');
        $('.toast-body').text('add ERROR')
       })
      } else alert('Thêm thất bại. xin hãy thêm môn học lại sau');
    }
  }
   themMonHoc() {
     return new Promise((resolve, reject) => {
      const itemsRef = this.db.list('MonHoc');
      try{
        let newMonHoc = itemsRef.push(this.Monhoc).key;
        itemsRef.update(newMonHoc, { id: newMonHoc});
      }catch(err) {
        reject(err)
      }
      resolve("done!");
     });
  }


}
