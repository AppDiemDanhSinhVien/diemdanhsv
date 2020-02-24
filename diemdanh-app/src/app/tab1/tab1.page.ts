import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import {AuthenticationService} from '../services/authentication.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  qrDataRandom = null;
  qrData = null;
  createdCode = null;
  scannedCode = null;
  User:any;
  constructor(private authService: AuthenticationService, private barcodeScanner: BarcodeScanner) {
  
  }
  // function nay se run khi show component nay
  ionViewWillEnter() {
    this.authService.getUserCurrent().then((val) => {
      if(val) {
       return this.User = val;
      }
    });
  }
  createCode () {
    this.qrDataRandom = Math.random().toString(36).substring(5);
    this.createdCode = this.qrDataRandom;
    console.log(this.createdCode);
  }

  scanCode () {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text;
    })
  }
  
}
