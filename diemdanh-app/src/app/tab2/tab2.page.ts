import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import 'firebase/database';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from "../services/authentication.service";

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
    scannedCode = false;
    scannedError = false;
    scanLast = null;
    idMonHoc = null;
    MonHoc: any;
    User;
    Lop_ScannedSuccess = [];
    ClassRef: AngularFireList<any> = null;
    constructor(private barcodeScanner: BarcodeScanner,
        private db: AngularFireDatabase, public loadingController: LoadingController,
        private storage: Storage, private authService: AuthenticationService) {
        this.authService.getUserCurrent().then((val) => {
            if (val) {
                return this.User = val;
            }
        });
    }
    ionViewWillEnter() {

        this.storage.get('Lop_ScannedSuccess').then((val) => {
            if (val) {
                this.Lop_ScannedSuccess = val;
                this.runOncePerDay(); // run ham mot ngay mot lan
            }
        })
        if (!this.scannedCode) {
            this.scanCode();
        }

    }
    scanCode() {

        this.barcodeScanner.scan().then(barcodeData => {
            this.idMonHoc = barcodeData.text.slice(10); //lay key lop
            this.scannedCode = false;
            this.scannedError = false;
            this.scanLast = null;
            let date = new Date().toLocaleDateString();
            console.log(this.Lop_ScannedSuccess)
            let indexLop = this.Lop_ScannedSuccess.findIndex(d => d.date === date && d.idLop === this.idMonHoc);
            // kiem tra da diem danh mon hoc nay vao ngay hon nay chua
            if (indexLop >= 0) {
                console.log('da diem danh mon nay');
                this.getClassesWithKey(this.idMonHoc);
                this.scannedCode = true;
                this.scanLast = this.Lop_ScannedSuccess[indexLop].date;
            } else {
                console.log('chua diem danh');

                this.getClassesWithKey(this.idMonHoc).then(() => {
                    // load data
                    this.presentLoading();
                    return new Promise((resolve, reject) => {
                        this.db.list('SV/' + this.User.id + '/lop').valueChanges().subscribe((lop: any) => {
                            // tim lop cua sv hien tai dang logged                    
                            let data = lop.find((l) => l.idLop === this.idMonHoc);
                            if (data) resolve(data);
                            reject(new Error("It broken"));
                        });
                    });
                }).then(data => {
                    // kiem tra ma code qr va key lop can diem danh
                    if (this.MonHoc && data && this.MonHoc.qr === barcodeData.text) {
                        //let diPlus = data.diemdanh.di + 1;
                        // this.db.object('SV/' + user.key + '/lop/' + index + '/diemdanh').update({
                        //     di: diPlus
                        // });
                        this.scannedCode = true;
                        console.log("diem danh thanh cong")
                        // this.storage.get('Lop_ScannedSuccess').then((val) => {
                        //     if (val) {
                        //         this.Lop_ScannedSuccess = val
                        //     };
                        //     var date = new Date().toLocaleDateString();
                        //     this.Lop_ScannedSuccess.push({
                        //         date: date,
                        //         idLop: this.idMonHoc
                        //     });
                        //     this.storage.set('Lop_ScannedSuccess', this.Lop_ScannedSuccess);
                        //     console.log(`User have ID ${ user.key}  took attendance `);                           
                        // });
                    } else {
                        this.scannedError = true;
                        console.log("diem danh that bai")
                    }
                });
            }
        });
    }
    async presentLoading() {
        const loading = await this.loadingController.create({
            message: 'Scanning...',
            duration: 1500
        });
        await loading.present();

        const { role, data  } = await loading.onDidDismiss();
      
    }
    getClassesWithKey(id) {
        return new Promise((resolve, reject) => {
            this.db.list('MonHoc').valueChanges().subscribe((result) => {
                this.MonHoc = result.find((val: any) => val.id === id);
                resolve(this.MonHoc);
            });
        })
    }
    hasOneDayPassed() {
        // get today's date. eg: "7/37/2007"
        let date = new Date().toLocaleDateString();
        // check if have data yesterday  
        if (this.Lop_ScannedSuccess[0]) {
            // inferring a day has yet to pass since both dates are equal.
            if (this.Lop_ScannedSuccess[0].date == date)
                return false;
            return true;
        }
        return false;
    }
    runOncePerDay() {
        if (!this.hasOneDayPassed()) return false;

        // xoa data cac lop da diem danh luu trong storage
        console.log('remove data cu');
        this.storage.remove('Lop_ScannedSuccess').then(() => this.Lop_ScannedSuccess = [])
    }
}