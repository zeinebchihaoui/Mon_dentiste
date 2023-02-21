import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AddPhotoPage } from '../add-photo/add-photo.page';
import { ModalController, } from '@ionic/angular';
import { StorageService } from '../core/services/storage.service';
import { environment } from 'src/environments/environment';
import { IonLoaderService } from 'src/app/core/services/ion-loader.service';
import { LoadingController } from '@ionic/angular';
import { DocumentService } from '../core/services/document.service';

const { pathFile, clinic } = environment;

@Component({
  selector: 'app-photo-category',
  templateUrl: './photo-category.page.html',
  styleUrls: ['./photo-category.page.scss'],
})
export class PhotoCategoryPage implements OnInit {


  modelData: any;
  category: any[];
  gabarit: any;
  documents: any;
  patient: any;
  pathFile = '';
  folder = '';
  constructor(
    public router: Router,
    public modalCtrl: ModalController,
    private storage: StorageService,
    private activatedRoute: ActivatedRoute,
    public loadingController: LoadingController,
    private ionLoaderService: IonLoaderService,
    private documentService: DocumentService,
  ) {

  }

  async ionViewDidEnter() {
    this.patient = await this.storage.getObject('patient_info');
    this.getDocuments();

    //this.documents = await this.storage.getObject('patientDocuments');
    this.gabarit = await this.storage.getObject('gabarits');
    this.category = await this.gabarit.filter((x: any) => x.categorie === 'ISFESO');
    const name: any = await this.storage.getObject('clinic');
    this.pathFile = `${pathFile}${clinic[name].folder}/${this.patient.id_personne}/`;
    this.folder = name;
  }

  getDocuments() {
    this.ionLoaderService.startLoader();
    this.documents = [];
    this.documentService.getDocumentsByPatientId(this.patient.id_personne)
      .then((documents: any[]) => {
        this.documents = documents;
        this.loadImageByidGabrit();
        this.ionLoaderService.stopLoader();
      },
        (error: Error) => {
          console.log('error', error);
          this.ionLoaderService.stopLoader();
        });
  }


  async ngOnInit() {

    /*  this.category = [{
       backgroundcolor: "#1C1C1B",
       categorie: "ISFESO",
       id_gabarit_outil: 42,
       image: "Qk1ypQAAAAAAADYAAAAoAAAAZAAAAI0AAAABABgAAAAAADylA",
       imageCamera: "http://media.basmile.com/bergues/profilSourir.png",
       nom: "Profil sourire",
       ordre: 1,
       substitue: null,
     }] */

  }


  goBack() {
    this.router.navigate(['/tabs/photo']);
  }

  async selectCateg(category: any) {
    const modal = await this.modalCtrl.create({
      component: AddPhotoPage,
      componentProps: {
        category,
      },
    });
    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        this.getDocuments();
      }
    });
    return await modal.present();
  }


  loadImageByidGabrit() {
    this.category = this.category.map((x: any) => ({
        ...x,
        photo: (this.documents.find(p => p.idGabarit == x.id_gabarit_outil)) ? this.documents.find(p => p.idGabarit == x.id_gabarit_outil).fichier : '',
        nbImages: (this.documents) ? this.documents.filter(p => p.idGabarit == x.id_gabarit_outil).length : 0,
        listPhotos: this.documents.filter(p => p.idGabarit == x.id_gabarit_outil)
      }));
    console.log('listCategory', this.category);
  }




}
