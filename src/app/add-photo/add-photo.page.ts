import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/core/services/patient.service';
import { IonLoaderService } from '../core/services/ion-loader.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { CameraResultType, Camera } from '@capacitor/camera';
import { environment } from 'src/environments/environment';
import * as sha1 from 'sha1';
import { DocumentService } from '../core/services/document.service';
import { FullviewPage } from '../fullview/fullview.page';
import { File } from '@ionic-native/File/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
const { pathFile, clinic } = environment;

@Component({
  selector: 'app-add-photo',
  templateUrl: './add-photo.page.html',
  styleUrls: ['./add-photo.page.scss'],
})
export class AddPhotoPage implements OnInit {
  modelData: any;
  patient: any;
  pathFile = '';
  folder = '';
  category: any;
  /* image  */
  formData: FormData = new FormData();
  photo: any;
  pathImageMobile = '';
  payload: any;
  constructor(
    public navParams: NavParams,
    private modalController: ModalController,
    private patientService: PatientService,
    private fileOpener: FileOpener,
    private document: DocumentViewer,
    public file: File,
    public route: Router,
    private ft: FileTransfer,
    private documentService: DocumentService,
    private ionLoaderService: IonLoaderService,
    private storage: StorageService,
    private platform: Platform,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    this.category = navParams.get('category');

  }

  async ngOnInit() {
    console.log('category', this.category);
    this.patient = await this.storage.getObject('patient_info');

    const name: any = await this.storage.getObject('clinic');
    console.log('name', name);
    // this.pathFile = `${pathFile}${clinic[name].folder}/`
    this.pathFile = `${pathFile}${clinic[name].folder}/${this.patient.id_personne}`;
    this.folder = name;
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async openCamera() {
    const capturedImage = await Camera.getPhoto({
      quality: 60,
      resultType: CameraResultType.DataUrl,
      saveToGallery: false,
      allowEditing: false,
    });
    this.photo = await (await fetch(capturedImage.dataUrl)).blob();
    this.pathImageMobile = capturedImage.dataUrl;
    this.addPhoto(this.photo);
  }

  async addPhoto(photo: any) {
    console.log('this.pathImageMobile', this.pathImageMobile);
    const destName = sha1(this.pathImageMobile);
    let img64: any = await this.reduce_image_file_size(this.pathImageMobile);
    img64 = img64.replace('data:image/png;base64,', '').toString();
    const raw = window.atob(img64);
    const vignette = window.btoa(raw);

    const n = raw.length;
    const a = new Uint8Array(new ArrayBuffer(n));

    for (let i = 0; i < n; i++) {
      a[i] = raw.charCodeAt(i);
    }
    const blob = new Blob([a], { type: 'image/jpg' });
    const form = new FormData();
    form.append('file', blob);



    const payload: any = {};
    payload.pkObjet = 0;
    payload.nom = destName;
    payload.extension = 'JPG';
    payload.id_patient = this.patient.id_personne;
    payload.vignette = vignette;
    payload.width = 0;
    payload.height = 0;
    payload.taille = 0;
    payload.estidentite = 0;
    payload.dateCreation = null;
    payload.lastModif = null;
    payload.echelle = 1;
    payload.fichier = destName + '.JPG';
    payload.repStockage = this.folder + '/' + this.patient.id_personne;
    payload.syncPath = '';
    payload.dateInsertion = null;
    payload.auteur = null;
    payload.id_patient_orthalis = this.patient.id_personne;
    payload.idGabarit = this.category.id_gabarit_outil;
    console.log('this.payload', payload);


    this.ionLoaderService.startLoader();
    this.documentService.addObjet(payload)
      .then((res: any) => {
        console.log('res', res);
        this.documentService.sendImage(payload.fichier, payload.repStockage, form)
          .then((data: any) => {
            console.log('data', data);
            this.category.listPhotos.push(res);
            console.log('category', this.category);
            this.ionLoaderService.stopLoader();
            // this.sendPayloadImage(payload);
          },
            (error: Error) => {
              console.log('error', error);
              this.ionLoaderService.stopLoader();
            });
      },
        (error: Error) => {
          this.ionLoaderService.stopLoader();
          console.log('error', error);
        });
  }

  async fullView(srcDoc: any) {
    console.log('srcDoc', srcDoc);
    const fileExt = srcDoc.fichier.split('.').pop();
    if (fileExt === 'pdf' || fileExt === 'PDF') {
      this.openPdf(srcDoc.id_patient, srcDoc.fichier);
    } else {
      const modal = await this.modalController.create({
        component: FullviewPage,
        componentProps: {
          pathFile: `${this.pathFile}/${srcDoc.fichier}`
        }
      });
      modal.onDidDismiss().then((modelData) => {
        if (modelData !== null) {
          this.modelData = modelData.data;
          console.log('Modal Data : ' + modelData.data);
        }
      });
      return await modal.present();
    }

  }

  openPdf(patientId: any, titleFile: string) {
    const downloadUrl = `${this.pathFile}/${patientId}/${titleFile}`;
    const path = this.file.dataDirectory;
    const transfer = this.ft.create();
    transfer.download(downloadUrl, path + `${titleFile}`).then(entry => {
      const url = entry.toURL();
      if (this.platform.is('ios')) {
        this.document.viewDocument(url, 'application/pdf', {});
      } else {
        this.fileOpener.open(url, 'application/pdf')
          .then(() => console.log('File is opened'))
          .catch(e => console.log('Error opening file', e));
      }
    });
  }

  async reduce_image_file_size(base64Str, MAX_WIDTH = 370, MAX_HEIGHT = 200) {
    const resized_base64 = await new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL()); // this will return base64 image results after resize
      };
    });
    return resized_base64;
  }



  async OnDelet(photo: any) {
    console.log('photo', photo);
    const alert = await this.alertCtrl.create({
      header: 'Suppression photo',
      message: 'Voulez vous supprimer cette photo ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.deletPhoto(photo);
          }
        }]
    });
    await alert.present();
  }


  deletPhoto(photo) {
    this.documentService.deleteByObjet(photo.pkObjet).then((data: any) => {
      console.log('data1', data);
    });
    this.documentService.deleteObjet(photo.pkObjet).then((data: any) => {
      console.log('data2', data);
    });
 /*    var imageUrlPrefix = "/"  + photo.repStockage + "/" + photo.fichier;
    this.documentService.findAndRmove(imageUrlPrefix).then((data: any) => {
      console.log('data3', data)
    }); */
    this.modalController.dismiss();

  }


}
