import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { PatientService } from 'src/app/core/services/patient.service';
import { IonLoaderService } from '../core/services/ion-loader.service';
import { ModalController, NavParams,  Platform } from '@ionic/angular';
import { AppointementService } from '../core/services/appointement.service';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  patient: any;
  infoPatient: any;
  nextRdv: any;

  constructor(
    private authService: AuthService,
    private storage: StorageService,
    private patientService: PatientService,
    private appointementService: AppointementService,
    private ionLoaderService: IonLoaderService,
    public modalCtrl: ModalController,
    public platform: Platform,
    private router: Router) {

  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.storage.getObject('patient_info')
      .then(async (patient: any) => {
        console.log('🚀~   ~ patient', patient);
        this.patient = patient;
        this.getInfoPatient(this.patient.id_personne);
      });
  }



  async getInfoPatient(idPersonne: number) {
    this.infoPatient = Promise.all([
      await this.patientService.getValids(idPersonne),
      await this.appointementService.getPatientWithNextCCWeb(idPersonne)
    ]);
    console.log('this.infoPatient', this.infoPatient);
  }


  next() {
    this.infoPatient.then(async result => {
      // 0 -> q1cs , 1 -> rdv , 2 -> photos
      const value = result[0];
      console.log('value[0]', value[0]);
      console.log('value[1]', value[1]);
      console.log('value[2]', value[2]);
      console.log('result[1][0]', result[1][0]);
      // InjectedContext.nextRdv = result[1][0];
      //InjectedContext.patientActs = result[1];
      if (value[1] > 0 || !result[1][0]) {
        this.router.navigate(['/tabs/home']);
      }
      else {
        if (value[0] == 0) {
          this.router.navigate(['/preliminary'], { queryParams: { q1csExist: true } });
        }
        if (value[0] > 0 && value[2] > 0) {
          this.router.navigate(['/preliminary'], { queryParams: { q1csExist: false, rdvExist: true } });
        }
      }
    });
  }




}
