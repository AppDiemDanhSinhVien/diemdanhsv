import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { QuanlyGVComponent } from './quanly-gv/quanly-gv.component';
import { QuanlyLopComponent } from './quanly-lop/quanly-lop.component';
import { QuanlySinhvienComponent } from './quanly-sinhvien/quanly-sinhvien.component';
import { SigninComponent } from './signin/signin.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuanlyGVComponent,
    QuanlyLopComponent,
    QuanlySinhvienComponent,
    SigninComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', 	component: HomeComponent },
      {path: 'quanly-giaovien', component:QuanlyGVComponent},
      {path: 'quanly-sinhvien', component:QuanlySinhvienComponent},
      {path: 'quanly-lop', component:QuanlyLopComponent},
      {path: 'signin', component:SigninComponent},
      {path: '**', redirectTo: '', pathMatch: 'full'}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
