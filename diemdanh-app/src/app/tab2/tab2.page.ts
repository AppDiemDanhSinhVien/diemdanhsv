import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import 'firebase/database';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from "../services/authentication.service";
import { map } from 'rxjs/operators';

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
    alert_MH_ChuaBatDau = null;
    MonHoc: any;
    User;
    ClassRef: AngularFireList<any> = null;
    constructor(private barcodeScanner: BarcodeScanner,
        private db: AngularFireDatabase, public loadingController: LoadingController,
        private authService: AuthenticationService) {
        


    }
    ionViewWillEnter() {
        this.scannedCode = false;
        this.scannedError = false;
        this.scanLast = null;
        this.idMonHoc = null;
        this.alert_MH_ChuaBatDau = null;
        this.MonHoc = null;
        this.authService.getUserCurrent().then((val) => {
            if (val) {
                return this.User = val;
            }
        });
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
            this.alert_MH_ChuaBatDau = null;
            let date = new Date().toLocaleDateString();

            this.checkDaDiemDanh().then((result: any) => {
                // kiem tra da diem danh mon hoc nay vao ngay hon nay chua
                console.log(this.User);
                console.log(result.diemdanhlancuoi)
                if (result.diemdanhlancuoi == date) {
                    // console.log('da diem danh mon nay');
                    this.getClassesWithKey(this.idMonHoc);
                    this.scannedCode = true;
                    this.scanLast = result.diemdanhlancuoi;
                } else {
                    //console.log('chua diem danh');
                    this.getClassesWithKey(this.idMonHoc).then((result) => {
                        // load data
                        this.MonHoc = result;
                        this.presentLoading();
                        if (!this.MonHoc.diemdanh) {
                            // console.log("khong co diem danh");
                            this.alert_MH_ChuaBatDau = "Môn học này chưa bắt đầu!"
                            this.scannedError = true;
                            return;
                        }
                        
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
                            this.getMonHocCuaSV(this.User.id).then((result: any) => {
                                let index = result.find(lop => lop.idLop === this.MonHoc.id);
                                if (index) {
                                    let date = new Date().toLocaleDateString();
                                    this.db.list(`SV/${this.User.id}/lop`).update(index.id, { diemdanhlancuoi: date })
                                }
                            });

                            let buoi = Object.values(this.MonHoc.diemdanh).length;
                            let keyBuoi: any;
                            keyBuoi = Object.values(this.MonHoc.diemdanh)[buoi - 1];
                            this.db.list('MonHoc/' + this.MonHoc.id + "/diemdanh/" + keyBuoi.id + "/comat").push({id: this.User.id, tensv: this.User.tensv});
                            console.log("diem danh thanh cong");
                            this.scannedCode = true;
                        } else {
                            this.scannedError = true;
                            console.log("diem danh that bai")
                        }
                    })
                }
            }).catch(err => {
                console.log("error");
                console.log(err);
                this.scannedError = true;
            });
        });
    }
    async presentLoading() {
        const loading = await this.loadingController.create({
            message: 'Scanning...',
            duration: 1500
        });
        await loading.present();

        const { role, data } = await loading.onDidDismiss();

    }
    getClassesWithKey(id) {
        return new Promise((resolve, reject) => {
            this.db.list('MonHoc').valueChanges().subscribe((result) => {
                this.MonHoc = result.find((val: any) => val.id === id);
                if (this.MonHoc) { resolve(this.MonHoc); }
                reject(new Error("not Found"));
            });
        })
    }
    getMonHocCuaSV(idSV) {
        return new Promise((resolve, reject) => {
            this.db.list(`SV/${idSV}/lop`).snapshotChanges()
                .pipe(map(items => { // <== new way of chaining
                    return items.map(a => {
                        let data: any;
                        data = a.payload.val();
                        const id = a.payload.key;
                        return {
                            id, ...data
                        }; // or {key, ...data} in case data is Obj
                    });
                })).subscribe(lop => {
                    resolve(lop)
                });
        })
    }

    checkDaDiemDanh() {
        // check if have data yesterday
        let index: any;
        return new Promise((resolve, reject) => {
            this.db.list(`SV/${this.User.id}/lop`).valueChanges().subscribe(res => {
                index = res.find((mh: any) => mh.idLop === this.idMonHoc);
                if (index) resolve(index);
                reject(new Error("Not Found"))
            });
        })
    }

}