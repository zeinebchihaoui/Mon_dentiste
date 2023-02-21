import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AppointementService } from "./appointement.service";
import { forkJoin, Observable } from 'rxjs';
import { StorageService } from "./storage.service";
const { clinic } = environment;


@Injectable({
    providedIn: 'root'
})


export class PatientService {


    constructor(
        private http: HttpClient,
        private storage: StorageService,
        appointementService: AppointementService) {
    }

    async getAttributs() {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get<any>(`${clinic[name].apiUrl}/Attributs`).toPromise();
    }

    async getAllGabarit() {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get<any>(`${clinic[name].apiUrl}/selectallgabarit`).toPromise();;
    }

    async getActes() {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get<any>(`${clinic[name].apiUrl}/Actes`).toPromise();
    }

    async getSmall(term: string) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get<any>(`${clinic[name].apiUrl}/getsmall/0&${term}`).toPromise();
    }

    async getPatientInfos(patientId: number) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get<any>(`${clinic[name].apiUrl}/personne/getAllCoordPatient/${patientId}`).toPromise();
    }

    async getPatientData(patientId: number, term: string) {
        const name: any = await this.storage.getObject('clinic');
        let res1 = this.http.get<any>(`${clinic[name].apiUrl}/Attributs`).toPromise();
        let res2 = this.http.get<any>(`${clinic[name].apiUrl}/selectallgabarit`).toPromise();
        let res3 = this.http.get<any>(`${clinic[name].apiUrl}/Actes`).toPromise();
        let res4 = this.http.get<any>(`${clinic[name].apiUrl}/getsmall/0&${term}`).toPromise();
        let res5 = this.http.get<any>(`${clinic[name].apiUrl}/personne/getAllCoordPatient/${patientId}`).toPromise();
        let res6 = this.http.get<any>(`${clinic[name].apiUrl}/PatientNextCCWebByIdPatient/${patientId}`).toPromise();
        return forkJoin([res1, res2, res3, res4, res5, res6]).toPromise();
    }

    async getValids(patientId: number) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get<any>(`${clinic[name].apiUrl}/validEtapes/${patientId}`).toPromise();
    }

    async getResumePatient(patientId: number) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get<any>(`${clinic[name].apiUrl}/getResumePatient/${patientId}`).toPromise();
    }

    async  addResume(resume: any) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.post<any>(`${clinic[name].apiUrl}/resume/insertResume`, resume).toPromise();
    }

    async  addQMedical(qustionnaire: any) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.post<any>(`${clinic[name].apiUrl}/qMedical/insertQ`, qustionnaire).toPromise();
    }

}