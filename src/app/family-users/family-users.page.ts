import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/core/services/patient.service';
import { IonLoaderService } from '../core/services/ion-loader.service';
import { StorageService } from 'src/app/core/services/storage.service';


@Component({
  selector: 'app-family-users',
  templateUrl: './family-users.page.html',
  styleUrls: ['./family-users.page.scss'],
})

export class FamilyUsersPage implements OnInit {

  users: any;

  constructor(
    public navParams: NavParams,
    private modalController: ModalController,
    private patientService: PatientService,
    private ionLoaderService: IonLoaderService,
    private storage: StorageService,
    private router: Router
  ) {
    this.users = navParams.get('users');
  }


  ngOnInit() {

  }


  dismiss() {
    this.modalController.dismiss();
  }

  selectPatient(user: any) {
    this.storage.setObject('patient_info', user);
    this.getPatientData(user.id_personne);

  }


  getPatientData(idPersonne: number) {
    this.ionLoaderService.startLoader();
    this.patientService.getPatientData(idPersonne, '')
      .then(responseList => {
        console.log('responseList',responseList);
        console.log('responseList[0]',responseList[0]);
        this.storage.setObject('attributs', responseList[0]);
        this.storage.setObject('gabarits', responseList[1]);
        this.storage.setObject('actes', responseList[2]);
        this.storage.setObject('praticiens', responseList[3]);
        this.storage.setObject('patientData', responseList[4]);
        (responseList[5][0]) ? this.storage.setObject('nextRdv', responseList[5][0])
          : this.storage.setObject('nextRdv', {});
        this.storage.setObject('patientData', responseList[5]);
        this.modalController.dismiss();
        this.router.navigate(['/welcome']);
        this.ionLoaderService.stopLoader();
      });
  }


  formatDate(date): any {
    const dateConvert = new Date(date);
    const day = (dateConvert.getDate() < 10 ? '0' : '') + dateConvert.getDate();
    const month = ((dateConvert.getMonth() + 1) < 10 ? '0' : '') + (dateConvert.getMonth() + 1);
    const year = dateConvert.getFullYear();
    const hour = dateConvert.getHours();
    return `${day}/${month}/${year}`;
  }

}
