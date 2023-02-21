import { Component, OnInit } from '@angular/core';
import { AppointementService } from 'src/app/core/services/appointement.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { IonLoaderService } from 'src/app/core/services/ion-loader.service';
import { Router ,ActivatedRoute} from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CallClinicalPage } from '../call-clinical/call-clinical.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


  listAppointements: any[] = [];
  titleBadge = 'Réserver rendez vous de suivi';
  alertAction = false;
  nextRDV: any;
  q1csExist: boolean;
  rdvExist: boolean;

  constructor(
    private route: Router,
    private appointementService: AppointementService,
    private storage: StorageService,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private ionLoaderService: IonLoaderService, ) {
      this.activatedRoute.queryParams.subscribe(params => {
        console.log('this.params', params);
        this.q1csExist = params.q1csExist;
        this.rdvExist = params.rdvExist;
      });
    }



  ngOnInit() {
  }

  ionViewDidEnter() {
    this.storage.getObject('nextRdv')
      .then((nextRdv: any) => {
        this.nextRDV = nextRdv;
        console.log('🚀 ~ file: home.page.ts ~ .then ~ this.nextRDV', this.nextRDV);
      });
  }

  bookingAppoitment() {
    if (this.nextRDV && this.nextRDV.idActe) {
      this.route.navigate([`./booking`]);
    } else {
      this.modalController.create(
        {
           component: CallClinicalPage ,
           mode:'md'

        })
        .then((modalElement) => {
          modalElement.present();
        });
    }
  }

  goBack(){
    this.route.navigate(['/preliminary'], { queryParams: { q1csExist: this.q1csExist, rdvExist: this.rdvExist } });
  }

  /*   this.storage.getObject('patient_info')
      .then((patient: any) => {
        this.getAppointements(patient.id_personne);
      }); */

  /* getAppointements(patientId: number) {
    this.listAppointements = [];
    //this.ionLoaderService.startLoader();
    this.appointementService.getAppointementsByPatientId(patientId)
      .subscribe((appointements: any[]) => {
        this.listAppointements = appointements;
        if (this.listAppointements.length) {
          this.titleBadge = 'Réserver rendez vous de suivi';
        } else {
          this.titleBadge = 'Réserver premier rendez-vous';
        }
        this.ionLoaderService.stopLoader();
      },
        (error: Error) => {
          console.log("error", error);
          this.ionLoaderService.stopLoader();
        });
  } */





}
