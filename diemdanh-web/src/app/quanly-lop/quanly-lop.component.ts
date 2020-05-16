import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList  } from '@angular/fire/database';
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators';
declare var $:any;

@Component({
  selector: 'app-quanly-lop',
  templateUrl: './quanly-lop.component.html',
  styleUrls: ['./quanly-lop.component.css']
})
export class QuanlyLopComponent implements OnInit {
  itemsRef: AngularFireList<any>;
  Lop: any;
  loading = true;
  constructor(db: AngularFireDatabase) {

  this.itemsRef = db.list('LOP');

    this.getLopHoc().then(result => {
      result.subscribe(val => {
        this.Lop = val;
        this.loading = false;
      })
    }).catch(err => console.log(err));
  }

  ngOnInit() {
    $('.toast').toast({
      delay: 3000,
      autohide: true
    });
    // Tìm kiếm lớp
  }
  async getLopHoc() {
     return await this.itemsRef.snapshotChanges().pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      );
  }
  // xóa lớp
  deleteLop(key: string){
    var result = confirm("Are you sure remove this?");
    if(result)  {
      this.itemsRef.remove(key);
      $('.toast').toast('show');
      $('.toast-body').text('delete completed!')
    }
  }
  // sort lop
  sortNewToOld() {
   this.Lop.reverse()
  }
  searchLop(event: any) {
    let xoaDau = function xoa_dau(str) {
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/đ/g, "d");
      str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
      str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
      str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
      str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
      str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
      str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
      str = str.replace(/Đ/g, "D");
      return str;
  }
    var value = xoaDau(event.target.value).toLowerCase();
      $("#BangLop > tr").filter(function() {
        let text = $(this).text();
        $(this).toggle( xoaDau(text).toLowerCase().indexOf(value) > -1)
      });

  }

}
