import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

const { clinic } = environment;

@Injectable({
    providedIn: 'root'
})

export class UserService {


    constructor(private http: HttpClient,
        private storage: StorageService) {
    }

    async  getUsers() {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get<any>(`${clinic[name].apiUrl}/Utilisateurs`).toPromise();
    }

    async   getResumePatient(patientId: number) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get<any>(`${clinic[name].apiUrl}/getResumePatient/${patientId}`).toPromise();
    }

    async updatePersonneQ(personne, patientId: number) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.put<any>(`${clinic[name].apiUrl}/personne/updatePersonneQ/${patientId}`,personne).toPromise();
      }
}
