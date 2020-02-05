import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Lop } from '../lop';
import {  map} from 'rxjs/operators';
declare var $:any;
@Component({
  selector: 'app-edit-lop',
  templateUrl: './edit-lop.component.html',
  styleUrls: ['./edit-lop.component.css']
})
export class EditLopComponent implements OnInit {
  GiaoVien: any;
  lop: Lop = new Lop;
  id:any;
  index = -1;
  schedule = {
    thuday: null,
    gioday: {giobd: null, giokt: null}
  }
  editSchedule = {
    thuday: null,
    gioday: {giobd: null, giokt: null}
  }
  lichDay = [];
  LopRef: AngularFireList<Lop> = null;
  private dbPath = null;

  constructor(public db: AngularFireDatabase, private activatedRoute: ActivatedRoute) {
    db.list('GV').valueChanges().subscribe(gv => this.GiaoVien = gv);
    this.activatedRoute.paramMap.subscribe(pramas=>{this.id=pramas.get('id')});
    this.dbPath = '/LOP';
    this.LopRef = db.list(this.dbPath);
    this.LopRef.snapshotChanges()
    .pipe(map(items => { // <== new way of chaining
        return items.map(a => {
            const data = a.payload.val();
            const key = a.payload.key;
            return {
                key, ...data
            }; // or {key, ...data} in case data is Obj
        });
    })).subscribe(Lop => {
      this.lop =  Lop.find(lop => lop.key === this.id);
      this.lichDay = this.lop.lichday;
      setTimeout(()=>{console.log(this.lop);},5000)
    });

  }

  ngOnInit() {
    $('.toast').toast({
      delay: 3000,
      autohide: true
    });
  }
  onSubmit() {
    if(this.lop.tenlop == '' || this.lop.tengv == '' || this.lop.ngaybatdau == '') {
     alert('Cập nhật thất bại! Hãy nhập đầy đủ thông tin!')
    }else{
      this.LopRef.update(this.id, this.lop);
      $('.toast').toast('show');
    }

  }
  themLichday() {
    this.lichDay.push(this.schedule);
     this.schedule = {
      thuday: null,
      gioday: {giobd: null, giokt: null}
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
}
