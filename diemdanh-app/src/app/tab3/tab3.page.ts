import { Component } from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {Storage} from '@ionic/storage';
import { LoadingController, AlertController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import 'firebase/database';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page {
  showForm = false;
  email = null;
  password = null;
  comfirmPass = null;
  keyUser = null;
  constructor(private db: AngularFireDatabase, public alertCon: AlertController, private authService: AuthenticationService,  public loadingController: LoadingController, private storage: Storage) {
  }
  ionViewWillEnter() {
    this.storage.get("LoggedInUser").then((val) => {
      if(val) {
      this.keyUser = val.key;
      this.email = val.email;
      this.password = val.password;
      }
    })
  }
  logout() {
    this.authService.logout();
  }
  popUpUpdate () {
    this.showForm = !this.showForm;
  }
  UpdateInfor() {
    if( !this.email || !this.password) {
      this.Alert('Error','Please enter your infor !');
    }else if(this.password !== this.comfirmPass){    
      this.Alert('Error','Comfirm password not right !');
    }else{
      this.presentLoading();
      this.db.object('SV/'+this.keyUser).update({email: this.email, password: this.password});
      this.authService.updateInfor(this.keyUser);
    }
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Updating...',
      duration: 1000 
    });
    await loading.present();
    await loading.onDidDismiss();
    this.Alert('Success', 'Updated your infor');
  }
  async Alert(title,msg) {
    const alert = await this.alertCon.create({
      header: title,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
}
