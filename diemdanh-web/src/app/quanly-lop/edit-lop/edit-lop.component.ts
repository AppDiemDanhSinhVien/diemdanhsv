import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { MonHoc } from '../monhoc';
import {  map} from 'rxjs/operators';
declare var $:any;
@Component({
  selector: 'app-edit-lop',
  templateUrl: './edit-lop.component.html',
  styleUrls: ['./edit-lop.component.css']
})
export class EditLopComponent implements OnInit {
  GiaoVien: any;
  MonHoc: MonHoc = new MonHoc;
  id:any;
  schedule = {
    thuday: null,
    gioday: {giobd: null, giokt: null}
  }
  isAddSV = false;
  isSearchSV = false;
  resultSearch;
  lichDay: any;
  isLoading = true;
  addlichday = false;
  inputIdSV = null;
  svDangHoc = false;
  LopRef: AngularFireList<MonHoc> = null;
  allSV;
  private dbPath = null;
  constructor(public db: AngularFireDatabase, private activatedRoute: ActivatedRoute, private router: Router) {
    db.list('GV').valueChanges().subscribe(gv => this.GiaoVien = gv);
    this.activatedRoute.paramMap.subscribe(pramas=>{this.id=pramas.get('id')});
    this.dbPath = '/MonHoc';
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
      this.MonHoc =  Lop.find(lop => lop.key === this.id);
      if(!this.MonHoc) {
        router.navigate(['/quanly-lop'])
      }
      this.lichDay = this.MonHoc.lichday;
      this.isLoading = false;
    });

    db.list('SV').valueChanges().subscribe((val: any) => {
      this.allSV = val;
    })

  }

  ngOnInit() {
    $('.toast').toast({
      delay: 3000,
      autohide: true
    });
  }
  onSubmit() {
    if(this.MonHoc.tenmonhoc == '' || this.MonHoc.tengv == '' || this.MonHoc.ngaybatdau == '') {
     alert('Cập nhật thất bại! Hãy nhập đầy đủ thông tin!')
    }else{
      this.LopRef.update(this.id, this.MonHoc);
      $('.toast').toast('show');
      $('.toast-body').text('update completed!');
    }

  }
  themLichday() {
    this.LopRef.update(this.id, {lichday: this.schedule});
    setTimeout(() =>  {this.addlichday = false}, 2000)
  }
  removeLich(i){
    var result = confirm('are you sure remove this ?');
    if(result) {
      this.LopRef.remove(`${this.id}/lichday`);
      this.addlichday = true;
    }

  }
  editLich(){
    $('#editSchedule').modal('show');

  }
  updateSchedule() {
    $('#editSchedule').modal('hide');
    this.LopRef.update(this.id, {lichday: this.lichDay});
  }

  showAddSV() {
    this.isAddSV = true;

  }
   searchStudent() {
    this.resultSearch = null;
    this.isSearchSV = true;
    this.svDangHoc = false;
    this.db.list("SV").valueChanges().subscribe(SV => {
      this.resultSearch =  SV.find((s: any) => s.mssv === this.inputIdSV);
      $('#modalSV').modal('show');
      if(this.resultSearch){
        this.isSearchSV = false;
       let daco = this.getSV_HocMonNay(this.id).find(sv => sv.id === this.resultSearch.id);
       if(daco) this.svDangHoc = true;
      }else{
        console.log("not found");
        this.isSearchSV = false;
      }
    });

  }
  addSV() {
    let lop =  {
      idLop: this.id,
      tenLop: this.MonHoc.tenmonhoc
    }
    this.db.list("SV/" + this.resultSearch.id + "/lop").push(lop);
    alert("đã thêm sinh viên vào môn học này")
  }
  getSV_HocMonNay(idLop: string) {
    let arrSV = [];
    this.allSV.forEach(sv => {
      let svFind;
      if(sv.lop){
       svFind =  Object.values(sv.lop).find((l: any) => l.idLop === idLop);
        if(svFind){
          arrSV.push(sv)
        }
      }

     });
     return arrSV;
  }

}
