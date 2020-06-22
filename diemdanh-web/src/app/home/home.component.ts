import { Component, OnInit } from '@angular/core';
import {AuthService} from '../_services/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
// import {IgxDoughnutChartModule, IgxDoughnutChartComponent} from 'igniteui-angular-charts';

declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userLoggedIn: any;
  donutChartData = [
    {
      label: 'Liverpool FC',
      value: 5,
      color: 'red',
    },
    {
      label: 'Real Madrid	',
      value: 13,
      color: 'green',
    },
    {
      label: 'FC Bayern München',
      value: 5,
      color: 'blue',
    },
  ];
  items: Observable<any[]>;
  constructor(private auth: AuthService, db: AngularFireDatabase) {
    // this.auth.getClass();
    // this.auth.getGV();
    // this.auth.getStudent();
  }

  ngOnInit() {
    // this.auth;
    // this.auth.getClass();
    // this.auth.getGV();
    // this.auth.getStudent();
    $("a").click(function(){
      $("a.selectedcategoryServices").removeClass("selectedcategoryServices");
     $(this).addClass('selectedcategoryServices');
    });
  }
}
