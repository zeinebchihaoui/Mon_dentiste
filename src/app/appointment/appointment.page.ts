import { Component, OnInit } from '@angular/core';
import { AppointementService } from 'src/app/core/services/appointement.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { IonLoaderService } from 'src/app/core/services/ion-loader.service';
import { months } from 'src/app/core/enums/enum';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.page.html',
  styleUrls: ['./appointment.page.scss'],
})
export class AppointmentPage implements OnInit {

  futureAppointements: any[] = [];
  pastAppointements: any[] = [];
  dislayAppointements: boolean;


  constructor(private appointementService: AppointementService,
    private storage: StorageService,
    private ionLoaderService: IonLoaderService,) {

     }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.storage.getObject('patient_info')
      .then((patient: any) => {
        console.log('🚀~   ~ patient', patient);
        this.getAppointements(patient.id_personne);
      });
  }

  getAppointements(patientId: number) {
    this.futureAppointements = [];
    this.pastAppointements = [];
    this.ionLoaderService.startLoader();
    this.appointementService.getAppointementsByPatientId(patientId)
      .then((appointements: any[]) => {
        console.log('appointements', appointements);
        if (appointements.length > 0) {
          appointements = appointements.map((x: any) => {
            const appointementDate = new Date(x.rdvDate);
            return {
              id: x.idRdv,
              titleActe: x.acteLibelle,
              apptDuration: x.rdvDuree,
              apptPrice: x.prixActe,
              apptDate: appointementDate,
              apptDay: appointementDate.getDate(),
              apptMonth: months[appointementDate.getMonth()],
              apptYear: appointementDate.getFullYear(),
              apptHour: x.rdvDate.toString().substring(x.rdvDate.toString().length - 3, x.rdvDate.toString().length - 8),
              accomplished: x.rdvArrive ? true : false
            };
          });
          for (const appointement of appointements) {
            if (appointement.apptDate.getTime() >= new Date()) {this.futureAppointements.push(appointement);}
            else {this.pastAppointements.push(appointement);}
          }
          this.dislayAppointements = true;
          this.ionLoaderService.stopLoader();
        } else {
          this.dislayAppointements = false;
          this.ionLoaderService.stopLoader();
        }
      },
        (error: Error) => {
          console.log('error', error);
          this.ionLoaderService.stopLoader();
        });
  }

}
