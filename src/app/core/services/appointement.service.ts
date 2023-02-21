import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

const { clinic } = environment;

@Injectable({
    providedIn: 'root'
})


export class AppointementService {


    constructor(private http: HttpClient, private storage: StorageService) {
    }

    async  getAppointementsByPatientId(patientId: number) {
        const name: any = await this.storage.getObject('clinic');

        return this.http.get<any>(`${clinic[name].apiUrl}/getAppointementsPatient/${patientId}`).toPromise();
    }

    async  getAppointementsByInterval(startDateStr: string, endDateStr: string) {
        const name: any = await this.storage.getObject('clinic');

        return this.http.get<any>(`${clinic[name].apiUrl}/AppointementByDateData/${startDateStr}&${endDateStr}`).toPromise();
    }

    async  getChairs() {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get<any>(`${clinic[name].apiUrl}/FauteuilsWeb`).toPromise();
    }

    async  getAffecations(startDateStr: string, endDateStr: string) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get<any>(`${clinic[name].apiUrl}/AffectationBetweenWeb/${startDateStr}&${endDateStr}`).toPromise();
    }

    async getHolidayDaysByInterval(startDateStr: string, endDateStr: string) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get<any>(`${clinic[name].apiUrl}/getAllJourFerieIntervalle/${startDateStr}&${endDateStr}`).toPromise();
    }

    async getStatusClinicByInterval(startDateStr: string, endDateStr: string) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get<any>(`${clinic[name].apiUrl}/getStatutCabinetIntervalle/${startDateStr}&${endDateStr}`).toPromise();
    }

    /** Deadline */
    async   getDeadlinesByPatientId(patientId: number) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get<any>(`${clinic[name].apiUrl}/getEcheances/${patientId}&false`).toPromise();
    }

    async  getListeHorraireReelByIdUser(userId: number, year: number, week: number) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get<any>(`${clinic[name].apiUrl}/getHoraireReelByIdUserWeekNumDay/${userId}/${year}/${week}`).toPromise();
    }

    async   getNextIdRdv() {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get<any>(`${clinic[name].apiUrl}/getNextIdRdv`).toPromise();
    }

    async  getPatientWithNextCCWeb(idPatient) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get<any>(`${clinic[name].apiUrl}/PatientNextCCWebByIdPatient/${idPatient}`).toPromise();
    }


    async  InsertRDV(appointement: any) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.post<any>(`${clinic[name].apiUrl}/Appointement/InsertNextRDV/`, appointement).toPromise();
    }

    async updateCommCliniqueIdRDV(data: any) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.put(`${clinic[name].apiUrl}/CommClinique/updateCommCliniqueIdRDV`, data).toPromise();
    }



}
