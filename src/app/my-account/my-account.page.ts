import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage.service';
import { PatientService } from '../core/services/patient.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {

  patient: any;
  q1csFilled: boolean;
  constructor(
    private storage: StorageService,
    private patientService: PatientService,
    private route: Router) { }

  ngOnInit() {

  }


  ionViewDidEnter() {
    this.storage.getObject('patient_info')
      .then((patient: any) => {
        console.log('🚀~   ~ patient', patient);
        this.patient = patient;
        this.patientService.getResumePatient(this.patient.id_personne)
          .then(async res => {
            this.q1csFilled = (res && res.id_personne) ? true : false;
            console.log('this.q1csFilled', this.q1csFilled);
          });
      });
  }

  goToPage(url: string) {
    this.route.navigate([`./${url}`]);
  }

  logOut() {
    this.storage.clear();
    this.storage.setObject('clinic', 'bergues');
    this.route.navigate([`/login`]);
  }

  openURL(url: string) {
    window.open(url, '_system', 'location=no');
  }

  openQ1cs() {
    this.route.navigate(['/q1cs'], { queryParams: { q1csFilled: this.q1csFilled } });
  }

}
