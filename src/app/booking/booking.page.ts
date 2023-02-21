import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppointementService } from 'src/app/core/services/appointement.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { IonLoaderService } from 'src/app/core/services/ion-loader.service';
import { UserService } from 'src/app/core/services/user.service';
import { DateConverterService } from 'src/app/core/services/date-converter.service';
import { professions } from 'src/app/core/enums/enum';
@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {


  patient: any;
  nextRDV: any;

  startTime = '07:00:00';
  endTime = '22:00:00';
  delayedInterval = 15;

  users: any[] = [];
  chairs: any[] = [];
  holidays: any[] = [];
  statusClinics: any[] = [];
  appointements: any[] = [];
  affectations: any[] = [];

  availableDate = 0;
  duration = 40;
  rdvperDay: Map<String, any> = new Map<String, any>();
  mapTimeToShow: Map<String, number> = new Map<String, number>();
  noTimeInDay = 0;
  dateAddedToMap = 0;
  dateValue: Date;

  bookingsPerDay: any[];
  bookingHours: any[];
  bookingForm: FormGroup;

  assistantStaff: any[] = [];
  practitionerStaff: any[] = [];
  chairId: number;
  q1csExist = false;
  rdvExist = false;

  constructor(private appointementService: AppointementService,
    private dateConverterService: DateConverterService,
    private ionLoaderService: IonLoaderService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private storage: StorageService,
    private router: Router,
    public toastController: ToastController) {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log('this.params', params);
      this.q1csExist = params.q1csExist;
      this.rdvExist = params.rdvExist;
    });
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.bookingForm = this.formBuilder.group({
      day: ['', Validators.required],
      hour: ['', Validators.required],
      practitioner: [''],
      assistant: [''],
      contactType: ['2', Validators.required],

    });
  }
  ionViewDidEnter() {

    this.storage.getObject('patient_info')
      .then((patient: any) => {
        this.patient = patient;
      });

    this.storage.getObject('nextRdv')
      .then((nextRdv: any) => {
        this.nextRDV = nextRdv;
        console.log('this.nextRDV', this.nextRDV);
      });

    this.getInfoBooking();

  }


  goBack() {
    if (this.rdvExist) {
      this.router.navigate(['/home'], { queryParams: { q1csExist: this.q1csExist, rdvExist: this.rdvExist } });
    } else {
      this.router.navigate(['/tabs/home']);
    }
  }

  onSelectedDay(event: any) {
    this.bookingHours = [];
    this.bookingHours = this.bookingsPerDay.find(x => x.day === event.detail.value).slots;
  }

  onSelectedHour(event: any) {
    this.chairId = this.bookingHours.find(x => x.time === event.detail.value).id;
    console.log('🚀  onSelectedHour ~ this.chairId', this.chairId);
    this.getPractitionerStaff(this.bookingForm.value.day, this.bookingForm.value.hour);
    this.getAssistantStaff(this.bookingForm.value.day, this.bookingForm.value.hour);
  }

  onSelectedPractitioner(event: any) {
    console.log('event.detail', event.detail.value);

  }

  onSelectedAssistant(event: any) {
    console.log('event.detail', event.detail.value);

  }

  async getPractitionerStaff(day: string, hour: string) {
    this.practitionerStaff = [];
    const timeHidden = this.rdvperDay.get(day);
    const dayAssignment = this.affectations.filter(x => (x.affecte_TO.toString().includes(day)));
    const filteredTime = timeHidden.filter(x => (x.time.includes(hour)));
    filteredTime.forEach((chair: any) => {
      const practitionerList: any = dayAssignment.filter(x => x.id_FAUTEUIL == chair.id
        && x.utilisateur.typeUtil == professions.Praticien);
      for (const practitioner of practitionerList) {
        this.practitionerStaff.push({ id: practitioner.id_USER, prenom: practitioner.prenom, nom: practitioner.nom });
      }

    });
  }

  async getAssistantStaff(day: string, hour: string) {
    this.assistantStaff = [];
    const dayAssignment = this.affectations.filter(x => (x.affecte_TO.toString().includes(day)));
    const timeHidden = this.rdvperDay.get(day);
    const filteredTime = timeHidden.filter(x => (x.time.includes(hour)));
    filteredTime.forEach((chair: any) => {
      const assistanteAffFiltredPerDay = dayAssignment.filter(x => x.id_FAUTEUIL == chair.id
        && x.utilisateur.typeUtil != professions.Praticien);
      for (const assistante of assistanteAffFiltredPerDay) {
        this.assistantStaff.push({ id: assistante.id_USER, prenom: assistante.prenom, nom: assistante.nom });
      }
    });
  }

  onSubmitForm() {
    const appointement: any = {};
    this.ionLoaderService.startLoader();
    this.appointementService.getNextIdRdv()
      .then((id: number) => {
        appointement.id_rdv = id;
        appointement.idCommClinique = this.nextRDV.idComm;;
        appointement.id_acte = this.nextRDV.idActe;
        appointement.id_fauteuil = this.chairId;
        appointement.id_personne = this.patient.id_personne;
        appointement.perIdPersonne = 2;
        appointement.rdvDate = formatDate(`${this.bookingForm.value.day} ${this.bookingForm.value.hour}`, 'yyyy-MM-dd HH:mm:ss', 'en-US');
        appointement.rdvStatut = 2;
        appointement.rdvDuree = !this.nextRDV ? 40 : this.nextRDV.acte_durestd;
        appointement.aAvancer = false;
        appointement.isExported = 'N';
        appointement.rdvComm = '';
        appointement.fromWeb = 1;
        appointement.moyenCommunication = this.bookingForm.value.contactType;
        console.log('appointement', appointement);
        this.appointementService.InsertRDV(appointement)
          .then(async (res: any) => {
            this.appointementService.updateCommCliniqueIdRDV({ id: appointement.idCommClinique, id_RDV: id });
            this.ionLoaderService.stopLoader();
            await this.presentToast('Rendez-vous ajouté avec succès');
            this.router.navigate(['/tabs/home']);
          },
            (error: Error) => {
              console.log('error', error);
              this.ionLoaderService.stopLoader();
            });
      },
        (error: Error) => {
          console.log('error', error);
          this.ionLoaderService.stopLoader();
        });
  }

  async getInfoBooking() {

    this.ionLoaderService.startLoader();
    const startDateStr: string = this.getStringDate(this.startTime);
    const endDateStr: string = this.getStringDate(this.endTime, this.delayedInterval);

    const result = Promise.all([
      await this.userService.getUsers(),
      await this.appointementService.getChairs(),
      await this.appointementService.getHolidayDaysByInterval(startDateStr, endDateStr),
      await this.appointementService.getStatusClinicByInterval(startDateStr, endDateStr),
      await this.appointementService.getAppointementsByInterval(startDateStr, endDateStr),
      await this.appointementService.getAffecations(startDateStr, endDateStr),
    ]);
    result.then(async (res: any) => {
      this.users = res[0];
      this.chairs = res[1].filter(x => x.Text == 'F1' || x.Text == 'F2' || x.Text == 'F3');
      this.holidays = res[2];
      this.statusClinics = res[3];
      this.appointements = res[4];
      this.affectations = res[5];

      await this.getAppointments();

      this.ionLoaderService.stopLoader();
    });



  }

  async getAppointments() {
    for (let i = 1; i <= this.delayedInterval; i++) {
      let restrictedDay = false;
      const date: Date = new Date();
      date.setDate(date.getDate() + i);
      const strDate = this.getStringDate('00:00:00', i); // format : YYYY-MM-DD
      if (date.getDay() == 0) {restrictedDay = true;}

      if (this.holidays && this.statusClinics) {
        this.holidays.map((holiday: any) => {
          if (strDate == holiday.date.toString().substring(0, 10)) { restrictedDay = true; };
        });
        this.statusClinics.map((clinic: any) => {
          if (strDate == clinic.date.toString().substring(0, 10)) { restrictedDay = true; };
        });
      }
      if (!restrictedDay) {
        await this.getTimeSlotsPossiblePerDay(strDate);
      }
    }

  }


  async getTimeSlotsPossiblePerDay(strDate: string) {
    const filtredAppointement = this.appointements.filter(x => x.StartTime.toString().includes(strDate));
    const dayAssignment = this.affectations.filter(x => (x.affecte_TO.toString().includes(strDate)));
    if (this.chairs)
      {this.chairs.map(async (chair: any) => {
        const { Id } = chair;
        const affectationPerChair = dayAssignment.filter(aff => aff.id_FAUTEUIL == Id);
        if (affectationPerChair.length > 0) {
          this.availableDate++; // know dates availables
          let tabHorairesReel: any[] = [];
          for (let i = 0; i < affectationPerChair.length; i++) {

            const currenntUser = this.users.find(u => u.idPersonne == affectationPerChair[i].id_USER);
            if (currenntUser) {
              affectationPerChair[i].utilisateur = currenntUser;
              if (currenntUser.typeUtil !== professions.Praticien)
                {continue;}
            }

            const horaireReelDate = new Date(affectationPerChair[i].affecte_FROM);
            const year = horaireReelDate.getFullYear();
            const month = horaireReelDate.getMonth();
            const day = horaireReelDate.getDate();
            let weekNumber;
            let dayNumber;

            await this.dateConverterService.getWeekNumber(day, month, year).then(res => { weekNumber = res; });
            await this.dateConverterService.getdayNumInWeek(day, month, year).then(res => { dayNumber = res; });
            await this.getHoraireTravail(affectationPerChair[i].id_USER, year, dayNumber, weekNumber, strDate)
              .then((res: any) => {
                tabHorairesReel = res;
              });
          }
          if (filtredAppointement) {
            const rdvPerFauteuil = filtredAppointement.filter(rdv => rdv.FauteuilId == Id);
            const tabRdv = [];
            rdvPerFauteuil.forEach(rdv => {
              const { StartTime, EndTime } = rdv;
              const startTime = new Date(StartTime);
              const endTime = new Date(EndTime);
              const obj = { debut: startTime, fin: endTime };
              tabRdv.push(obj);
            });
            const sortedTabRdv = rdvPerFauteuil.slice().sort((a, b) => new Date(a.StartTime).getTime() - new Date(b.StartTime).getTime());
            let id: number;
            if (rdvPerFauteuil.length > 0)
              {id = rdvPerFauteuil[0].FauteuilId;}
            else
              {id = Id;}
            this.creationListOfEmptyArea(sortedTabRdv, tabHorairesReel, id, strDate);
          }
        }
      });}
  }


  async getHoraireTravail(userId: number, year: number, dayNumber: number, weekNumber: number, strDate: string) {
    let workInDay: any[] = [];
    const tabHorairesReel = [];
    await this.appointementService.getListeHorraireReelByIdUser(userId, year, weekNumber)
      .then(async (res: any) => {
        workInDay = res.filter(p => (p.dayNum == dayNumber));
        let k = 0;
        while (k + 1 <= workInDay.length) {
          const startHour = new Date(strDate + ' ' + workInDay[k].startTime);
          const endHour = new Date(strDate + ' ' + workInDay[k].endTime);
          tabHorairesReel.push({ debut: startHour, fin: endHour });
          k++;
        }
      });
    return tabHorairesReel;
  }

  async creationListOfEmptyArea(RdvTab, tabHorairesReel, id, strDate) {
    if (tabHorairesReel.length > 0) {
      const emptyArea = [];
      let start;
      let startAfternoun;
      let endMorning;
      let end;
      if (tabHorairesReel.length == 1) {
        start = new Date(tabHorairesReel[0].debut);
        endMorning = new Date(tabHorairesReel[0].fin);
        end = new Date(tabHorairesReel[0].fin);
      } else {
        start = new Date(tabHorairesReel[0].debut);
        startAfternoun = new Date(tabHorairesReel[1].debut);
        endMorning = new Date(tabHorairesReel[0].fin);
        end = new Date(tabHorairesReel[1].fin);
      }
      const lunchTime: any = {};
      lunchTime.StartTime = endMorning;
      lunchTime.EndTime = startAfternoun == undefined ? endMorning : startAfternoun;
      RdvTab.push(lunchTime);

      RdvTab = RdvTab.slice().sort((a, b) => new Date(a.StartTime).getTime() - new Date(b.StartTime).getTime());

      if (RdvTab.length > 0) {
        let pointerTime: Date = new Date(RdvTab[0].StartTime);
        const lengthTab = RdvTab.length;
        const firstRdv = new Date(RdvTab[0].StartTime);
        const lastRdv = new Date(RdvTab[lengthTab - 1].EndTime);
        const startWork = start;
        const endWork = end;
        if (startWork.getTime() < firstRdv.getTime()) {
          const initRDV = { debut: startWork, fin: firstRdv };
          emptyArea.push(initRDV);
        }
        for (let k = 0; k < lengthTab - 1; k++) {
          const tmpstartRDV = new Date(RdvTab[k].EndTime);
          let tmpendRDV = new Date(RdvTab[k + 1].StartTime);
          if ((tmpstartRDV.getTime() >= new Date(RdvTab[k + 1].EndTime).getTime()) && (new Date(RdvTab[k].StartTime).getTime() <= tmpendRDV.getTime()) && k < lengthTab - 2) {
            k++;
            tmpendRDV = new Date(RdvTab[k + 1].StartTime);
          }
          if (pointerTime.getTime() >= tmpstartRDV.getTime()) {
            continue;
          }
          if (new Date(RdvTab[k].StartTime).getTime() < pointerTime.getTime() && tmpstartRDV.getTime() > pointerTime.getTime()) {
            pointerTime = tmpstartRDV;
            continue;

          }

          else if ((tmpstartRDV.getTime() >= new Date(RdvTab[k + 1].EndTime).getTime() && new Date(RdvTab[k].StartTime).getTime() >= tmpendRDV.getTime())) {
            pointerTime = tmpstartRDV;
            continue;
          }
          else {
            pointerTime = tmpstartRDV;
          }
          const startNextRDV = tmpstartRDV;
          const endRDV = tmpendRDV;
          const obj = { debut: startNextRDV, fin: endRDV };
          if (startNextRDV.getTime() < endRDV.getTime()) {
            emptyArea.push(obj);
          }
        }

        if (endWork.getTime() > pointerTime.getTime() && endWork.getTime() > lastRdv.getTime()) {
          if (endWork.getTime() > lastRdv.getTime())
            {pointerTime = lastRdv;}
          emptyArea.push({ debut: pointerTime, fin: endWork });
        }

      }
      await this.makeItems(emptyArea, id, strDate);
    }
  }

  async makeItems(emptyArea: any[], id: number, strDate: string) {
    const timeHidden: any[] = [];
    emptyArea.map((x: any) => {
      const timeVisit: Date = x.debut;
      let timeBetween = Math.abs(x.fin.getTime() - timeVisit.getTime()) / 60000;
      while (timeBetween >= this.duration) {
        const emptyTime: any = { time: ('0' + timeVisit.getHours()).slice(-2) + ':' + ('0' + timeVisit.getMinutes()).slice(-2), id };
        timeHidden.push(emptyTime);
        timeBetween = timeBetween - this.duration;
        timeVisit.setMinutes(timeVisit.getMinutes() + this.duration);
      }
    });

    // if there s a time in day we add it
    if (timeHidden.length == 0) {
      this.noTimeInDay++;
    } else {
      if (this.rdvperDay.has(strDate)) {
        this.rdvperDay.get(strDate).map(item => {
          const index = timeHidden.findIndex(x => x.time == item.time);
          if (index === -1) {
            timeHidden.push(item);
            // sort time in array when adding time with another chair
            timeHidden.sort((item1, item2) => {
              const time1 = item1.time.replace(':', '.');
              const time2 = item2.time.replace(':', '.');
              return parseFloat(time1) - parseFloat(time2);
            });
          }
        });
        this.rdvperDay.set(strDate, timeHidden);
      } else {
        this.rdvperDay.set(strDate, timeHidden);
      }
      this.dateAddedToMap++;
    }

    if (this.availableDate == this.noTimeInDay && this.dateAddedToMap == 0) {
      this.presentToast('Aucun RDV n\'est actuellement disponible merci de nous appeler pour un RDV rapide');
    }
    if (this.availableDate == this.dateAddedToMap + this.noTimeInDay && this.availableDate != this.noTimeInDay) {
      const parts: any = [...this.rdvperDay][0][0].split('-');
      console.log('parts', parts);
      this.dateValue = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      for (let i = 1; i < this.rdvperDay.size; i++) {
        const parts = [...this.rdvperDay][i][0].split('-');
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        if (date < this.dateValue)
          {this.dateValue = date;}
      }
    }

    this.bookingsPerDay = Array.from(this.rdvperDay, ([day, slots]) => ({ day, slots }));
    console.log('🚀 this.bookingsPerDay', this.bookingsPerDay);

  }

  getStringDate(hour: string, days?: number) {
    const today: Date = new Date();
    let year: number = today.getFullYear();
    let month: number = today.getMonth() + 1;
    let day: number = today.getDate();
    if (days) {
      const currDay = new Date();
      currDay.setDate(currDay.getDate() + days);
      year = currDay.getFullYear();
      month = currDay.getMonth() + 1;
      day = currDay.getDate();
    }
    return (hour != '00:00:00') ? `${year}-${month}-${day} ${hour}`
      : `${year}-${('0' + month).slice(-2)}-${('0' + day).slice(-2)}`;
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: `${msg}`,
      duration: 2000
    });
    toast.present();
  }

}
