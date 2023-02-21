import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

const { clinic } = environment;

@Injectable({
    providedIn: 'root'
})


export class DocumentService {

    constructor(private http: HttpClient, private storage: StorageService) {
    }

    async getDocumentsByPatientId(patientId: number) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get<any>(`${clinic[name].apiUrl}/getPhotosListById/${patientId}`).toPromise();
    }


    async sendImage(destName: string, path: string, file: any) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.post(`${clinic[name].apiUrl}/SaveImageNew/image/` + destName + '?path=' + path, file).toPromise();
        // return this.http.post(`${clinic[name].apiUrl}/SaveImageNew/image`, photo).toPromise();

    }


    async addObjet(payload: any) {
        console.log('opayloadbj', payload);
        const name: any = await this.storage.getObject('clinic');
        return this.http.post(`${clinic[name].apiUrl}/objet/add/`, payload).toPromise();
    }


    async deleteObjet(idObjet: any) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.delete(`${clinic[name].apiUrl}/objet/deleteObjet/` + idObjet).toPromise();
    }


    async findAndRmove(urlPath: any) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get(`${clinic[name].apiUrl}/findAndRmove?rep=` + urlPath).toPromise();
    }


    async deleteByObjet(pkObjet) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.delete(`${clinic[name].apiUrl}/lnkAttributsObjets/deleteByIdObjet/` + pkObjet).toPromise();
    }

    async createDossierPatient(path: string) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get(`${clinic[name].apiUrl}/CreatePatientDossier?rep=` + path);
    }






}
