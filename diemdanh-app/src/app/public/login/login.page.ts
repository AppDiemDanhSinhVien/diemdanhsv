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
  
  constructor(private authService: AuthenticationService, public loadingController: LoadingController, public alertController: AlertController) { 
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 1000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }
  async errorAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
  login() {
    if(this.email == null || this.password == null) {
      this.errorAlert('Hãy nhập đầy đủ thông tin !');
    }else{
      this.presentLoading(); 
      this.authService.login(this.email, this.password);      
      setTimeout(()=>{     
        if(!this.authService.authenticationState.value) {
          this.errorAlert('Đăng nhập thất bại !');
        }  
      },2000)
    }
    
  }
}
