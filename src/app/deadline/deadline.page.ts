import { Component, OnInit } from '@angular/core';
import { AppointementService } from 'src/app/core/services/appointement.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { IonLoaderService } from 'src/app/core/services/ion-loader.service';
import { months } from 'src/app/core/enums/enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deadline',
  templateUrl: './deadline.page.html',
  styleUrls: ['./deadline.page.scss'],
})
export class DeadlinePage implements OnInit {

  deadlines: any[] = [];
  totalCollection = 0;
  debitAmount = 0;

  constructor(private appointementService: AppointementService,
    private storage: StorageService,
    private router: Router,
    private ionLoaderService: IonLoaderService, ) { }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.storage.getObject('patient_info')
      .then((patient: any) => {
        console.log('🚀~   ~ patient', patient);
        this.getDeadlines(patient.id_personne);
      });
  }

  goBack() {
    this.router.navigate(['/tabs/account']);
  }

  getDeadlines(patientId: number) {
    this.deadlines = [];
    let debitAmount = 0;
    let totalCollection = 0;
    this.ionLoaderService.startLoader();
    this.appointementService.getDeadlinesByPatientId(patientId)
      .then((deadlines: any[]) => {
        console.log('deadlines', deadlines);
        this.deadlines = deadlines.map((x: any) => {
          const deadlineDate = new Date(x.dteecheance);
          if (x.id_ENCAISSEMENT == -1) {debitAmount += x.montant;}
          else {totalCollection += x.montant;}
          return {
            id: x.id,
            titleActe: x.libelle,
            idEncaissement: x.id_ENCAISSEMENT,
            amount: Math.round(x.montant),
            deadlineDate,
            deadlineDay: deadlineDate.getDate(),
            deadlineMonth: months[deadlineDate.getMonth()],
            deadlineYear: deadlineDate.getFullYear(),
            accomplished: (x.id_ENCAISSEMENT && !(x.id_ENCAISSEMENT == -1))
          };
        });
        this.debitAmount = Math.round(debitAmount);
        this.totalCollection = Math.round(totalCollection);
        this.ionLoaderService.stopLoader();
      },
        (error: Error) => {
          console.log('error', error);
          this.ionLoaderService.stopLoader();
        });
  }

}
