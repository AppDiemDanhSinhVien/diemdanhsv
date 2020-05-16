import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import 'firebase/database';
import { map } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
    scannedCode = false;
    scannedError = false;
    scanLast = null;
    keyLop = null;
    Lop: any;
    Lop_ScannedSuccess = [];
    ClassRef: AngularFireList < any > = null;
    constructor(private barcodeScanner: BarcodeScanner,
        private db: AngularFireDatabase, public loadingController: LoadingController,
        private storage: Storage) {

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
            this.keyLop = barcodeData.text.slice(10); //lay key lop
            this.scannedCode = false;
            this.scannedError = false;
            this.scanLast = null;
            let user: any, data, index;
            let date = new Date().toLocaleDateString();
            console.log('haha');
            console.log(this.Lop_ScannedSuccess)
            let indexLop = this.Lop_ScannedSuccess.findIndex(d => d.date === date && d.idLop === this.keyLop);
            // kiem tra da diem danh mon hoc nay vao ngay hon nay chua
            if (indexLop >= 0) {
                console.log('da diem danh mon nay');
                this.getClassesWithKey(this.keyLop);
                this.scannedCode = true;
                this.scanLast = this.Lop_ScannedSuccess[indexLop].date;
            } else {
                console.log('chua diem danh');
                this.getClassesWithKey(this.keyLop);
                // load data
                this.presentLoading();
                this.storage.get("LoggedInUser").then((val) => {
                    user = val;
                    this.db.list('SV/' + user.key + '/lop').valueChanges().subscribe((lop: any) => {
                        // tim lop cua sv hien tai dang logged
                        data = lop.find(l => l.key === this.keyLop);
                        index = lop.findIndex(l => l.key === this.keyLop); // lay index cua object de cap nhat Lop cua sv                    
                    });
                });
                // set 2 giay de load thong tin
                // kiem tra ma code qr va key lop can diem danh
                setTimeout(() => {
                    if (this.Lop && index >= 0 && data && this.Lop.qr === barcodeData.text) {
                        let diPlus = data.diemdanh.di + 1;
                        this.db.object('SV/' + user.key + '/lop/' + index + '/diemdanh').update({
                            di: diPlus
                        });
                        this.scannedCode = true;
                        this.storage.get('Lop_ScannedSuccess').then((val) => {
                            if (val) {
                                this.Lop_ScannedSuccess = val
                            };
                            var date = new Date().toLocaleDateString();
                            this.Lop_ScannedSuccess.push({
                                date: date,
                                idLop: this.keyLop
                            });
                            this.storage.set('Lop_ScannedSuccess', this.Lop_ScannedSuccess);
                            console.log(`User have ID ${ user.key}  took attendance `);                           
                        });
                    } else {
                        this.scannedError = true;
                        console.log("diem danh that bai " )
                        console.log( this.Lop)
                    }
                }, 2500);
            }

        });
    }
    async presentLoading() {
        const loading = await this.loadingController.create({
            message: 'Scanning...',
            duration: 1500
        });
        await loading.present();

        const {
            role, data
        } = await loading.onDidDismiss();
    }
    getClassesWithKey(key) {
        this.ClassRef = this.db.list('LOP');
        this.ClassRef.snapshotChanges()
            .pipe(map(items => { // <== new way of chaining
                return items.map(a => {
                    const data = a.payload.val();
                    const key = a.payload.key;
                    return {
                        key, ...data
                    }; // or {key, ...data} in case data is Obj
                });
            })).subscribe(lop => {
                this.Lop = lop.find(l => l.key === key);
            });
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