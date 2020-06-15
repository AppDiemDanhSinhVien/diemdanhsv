import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import { AlertController,LoadingController  } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = null;
  password = null;
  isLoading = false;
  constructor(private authService: AuthenticationService, public loadingController: LoadingController, public alertController: AlertController) { 
  }
  

  async errorAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
  async present() {
    this.isLoading = true;
    return await this.loadingController.create({
      // duration: 5000,
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }
  async dismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss();
  }

login() {
  if(this.email == null || this.password == null) {
    this.errorAlert('Hãy nhập đầy đủ thông tin !');
    return false;
    }
  this.present();
  this.authService.login(this.email, this.password)
  .then(() => this.dismiss()).catch(err => {
    this.dismiss();
    this.errorAlert('Đăng nhập thất bại !');
  });  
    
}

}
