import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule  } from '@angular/router';
import{FormsModule,ReactiveFormsModule }from '@angular/forms';
import { AuthGuard } from './_helpers/auth.guard';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { QuanlyGVComponent } from './quanly-gv/quanly-gv.component';
import { QuanlyLopComponent } from './quanly-lop/quanly-lop.component';
import { QuanlySinhvienComponent } from './quanly-sinhvien/quanly-sinhvien.component';
import { SigninComponent } from './signin/signin.component';
import { AddLopComponent } from './quanly-lop/add-lop/add-lop.component';
import { EditLopComponent } from './quanly-lop/edit-lop/edit-lop.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxDonutChartModule } from 'ngx-doughnut-chart'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuanlyGVComponent,
    QuanlyLopComponent,
    QuanlySinhvienComponent,
    SigninComponent,
    AddLopComponent,
    EditLopComponent
  ],
  imports: [
    BrowserModule,
    NgxPaginationModule,NgxDonutChartModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'app-diem-danh'),
    AngularFireDatabaseModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' , canActivate:
      [AuthGuard]},
      {path: 'quanly-giaovien', component:QuanlyGVComponent, canActivate:[AuthGuard]},
      {path: 'quanly-sinhvien', component:QuanlySinhvienComponent, canActivate:[AuthGuard]},
      {path: 'quanly-lop', component:QuanlyLopComponent, canActivate:[AuthGuard]},
      {path: 'quanly-lop/them-lop', component:AddLopComponent, canActivate:[AuthGuard]},
      {path: 'signin', component:SigninComponent},
      { path: 'quanly-lop/edit/:id', component: EditLopComponent },
      {path: '**', redirectTo: '', pathMatch: 'full'}
    ])
  ],
  providers: [  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
