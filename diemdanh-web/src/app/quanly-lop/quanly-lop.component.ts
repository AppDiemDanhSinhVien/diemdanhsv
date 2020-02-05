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
  Lop: Observable<any[]>;;
  constructor(db: AngularFireDatabase) {
    this.itemsRef = db.list('LOP');
    this.Lop = this.itemsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  ngOnInit() {
    $('.toast').toast({
      delay: 3000,
      autohide: true
    });
    // Tìm kiếm lớp
    $("#mySearch").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#BangLop tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  }
  // xóa lớp
  deleteLop(key: string){
    var result = confirm("Are you sure remove this?");
    if(result)  {
      this.itemsRef.remove(key);
      $('.toast').toast('show');
    }
  }
}
