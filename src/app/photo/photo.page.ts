import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { CameraResultType, Camera } from '@capacitor/camera';
import * as sha1 from 'sha1';
import { File } from '@ionic-native/File/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FullviewPage } from 'src/app/fullview/fullview.page';
import { DocumentService } from 'src/app/core/services/document.service';
import { IonLoaderService } from 'src/app/core/services/ion-loader.service';
import { environment } from 'src/environments/environment';
import { StorageService } from '../core/services/storage.service';
import { Router } from '@angular/router';

const { pathFile, clinic } = environment;

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
export class PhotoPage implements OnInit {

  modelData: any;
  documents: any[] = [];
  patient: any;
  pathFile = '';
  folder = '';
  /* image  */
  formData: FormData = new FormData();
  photo: any;
  pathImageMobile = '';

  constructor(public modalController: ModalController,
    private documentService: DocumentService,
    private ionLoaderService: IonLoaderService,
    private platform: Platform,
    public file: File,
    public route: Router,
    private ft: FileTransfer,
    private storage: StorageService,
    public loadingController: LoadingController,
    private fileOpener: FileOpener,
    private document: DocumentViewer,
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    this.patient = await this.storage.getObject('patient_info');
    const name: any = await this.storage.getObject('clinic');
    console.log('name', name);
    this.pathFile = `${pathFile}${clinic[name].folder}`;
    this.folder = name;
    this.getDocuments();
  }

  getDocuments() {
    this.ionLoaderService.startLoader();
    this.documents = [];
    this.documentService.getDocumentsByPatientId(this.patient.id_personne)
      .then((documents: any[]) => {
        this.documents = documents;
       // this.storage.setObject('patientDocuments', this.documents);
        console.log('this.documents', documents);
        this.ionLoaderService.stopLoader();
      },
        (error: Error) => {
          console.log('error', error);
          this.ionLoaderService.stopLoader();
        });
  }



  async fullView(srcDoc: any) {
    const fileExt = srcDoc.fichier.split('.').pop();
    if (fileExt === 'pdf' || fileExt === 'PDF') {
      this.openPdf(srcDoc.id_patient, srcDoc.fichier);
    } else {
      const modal = await this.modalController.create({
        component: FullviewPage,
        componentProps: {
          pathFile: `${this.pathFile}/${srcDoc.id_patient}/${srcDoc.fichier}`
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


  openCategPhoto(){
    console.log('this.documents',this.documents);
    this.route.navigate([`./photo-category`]);
  }

}
