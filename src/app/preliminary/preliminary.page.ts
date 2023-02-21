import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage.service';
import { PatientService } from '../core/services/patient.service';

@Component({
  selector: 'app-preliminary',
  templateUrl: './preliminary.page.html',
  styleUrls: ['./preliminary.page.scss'],
})
export class PreliminaryPage implements OnInit {

  q1csExist = false;
  rdvExist = false;
  q1csFilled = false;
  patient: any;

  constructor(
    private storage: StorageService,
    private route: Router,
    private patientService: PatientService,
    public activatedRoute: ActivatedRoute,

  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log('params', params);
      this.q1csExist = params.q1csExist;
      this.rdvExist = params.rdvExist;
    });
  }

  ngOnInit() {
    console.log('q1csExist', this.q1csExist);
    console.log('rdvExist', this.rdvExist);
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


  logOut() {
    this.storage.clear();
    this.route.navigate([`./login`]);
  }



}
