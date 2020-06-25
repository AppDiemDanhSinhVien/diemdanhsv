import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-quanly-lop',
  templateUrl: './quanly-lop.component.html',
  styleUrls: ['./quanly-lop.component.css']
})
export class QuanlyLopComponent implements OnInit {
  itemsRef: AngularFireList<any>;
  comat: AngularFireList<any>;
  MonHoc: any;
  loading = true;
  allSV;
  diemdanh;
  listSV;
  tenMH;
  listSVVang = [];
  countSVVang;
  constructor(db: AngularFireDatabase) {

    this.itemsRef = db.list('MonHoc');
    //this.comat = db.list("MonHoc/-M7Q7TwgaL-12rWUBkzx/")
    this.getMonHoc().then(result => {
      result.subscribe(val => {
        this.MonHoc = val;
        this.loading = false;
      })
    }).catch(err => console.log(err));
    db.list('SV').valueChanges().subscribe((val: any) => {
      this.allSV = val;
    })
  }

  ngOnInit() {
    $('.toast').toast({
      delay: 3000,
      autohide: true
    });
    // Tìm kiếm lớp
  }
  async getMonHoc() {
    return await this.itemsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }
  // xóa lớp
  deleteLop(key: string) {
    var result = confirm("Are you sure remove this?");
    if (result) {
      this.itemsRef.remove(key);
      $('.toast').toast('show');
      $('.toast-body').text('delete completed!')
    }
  }
  // sort lop
  sortNewToOld() {
    this.MonHoc.reverse()
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
    $("#BangLop > tr").filter(function () {
      let text = $(this).text();
      $(this).toggle(xoaDau(text).toLowerCase().indexOf(value) > -1)
    });

  }

  getStatusMonHoc(ngayBD) {
    let now = new Date().getTime();
    ngayBD = new Date(ngayBD).getTime();

    if (now < ngayBD) {
      return 0;
    } else {
      return 1;
    }

  }
  getSV_HocMonNay(monhoc) {
    if (monhoc.listsv) return Object.values(monhoc.listsv).length;
    return 0;
  }
  chitiet(diemdanh, ListSV, TenMH) {
    this.diemdanh = null;
    this.listSV = null;
    this.tenMH = null;
    this.listSVVang = [];
    this.countSVVang = null;
    $('#chitiet').modal('show');
    this.tenMH = TenMH;
    if (diemdanh) {
      this.diemdanh = Object.values(diemdanh);
      this.listSV = ListSV;
      // dem tong so lan van hoc cua mot sinh vien
      this.diemdanh.forEach((el: any) => {
        if(this.filterSV_VangHoc(el.comat))this.listSVVang.push(...this.filterSV_VangHoc(el.comat));
       });
      this.countSVVang = Object.values(this.countVang(this.listSVVang));
    }


  }

  checkObj(val) {
    if (val) {
      if (!Array.isArray(val)) {
        return Object.values(val).length;
      } else {
        return val.length;
      }
    } else {
      return [];
    }
  }

  convertToArr(val) {
    if (val) return Object.values(val);
    return [];

  }

  filterSV_VangHoc(svdh) {
    if (this.listSV) {
      let array = Object.values(this.listSV);
      let filteredArray: any;
      filteredArray = array.filter(function (array_el: any) {
        return svdh.filter(function (anotherOne_el) {
          return anotherOne_el == array_el.tensv;
        }).length == 0
      });
      return filteredArray;
    }

  }

   countVang(arr) {
    var count = {};
    arr.forEach(function(i) {
      count[i.id] = {
       vang: count[i.id]?count[i.id].vang + 1: 1,
       tensv: i.tensv
      }
    });
   return count;
   }
}
