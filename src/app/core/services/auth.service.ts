import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { tap, map } from 'rxjs/operators';
const { clinic } = environment;

export interface ApplicationUser {
    role: string;
    access_token: string;
}

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    apiUrl ;
    private currentUserSubject: BehaviorSubject<ApplicationUser>;
    public currentUser: Observable<ApplicationUser>;
    private static readonly TOKEN_NAME: string = 'access_token';

    constructor(private http: HttpClient, private storage: StorageService) {
        this.currentUserSubject = new BehaviorSubject<ApplicationUser>(this.getUserFromToken());
        this.currentUser = this.currentUserSubject.asObservable();
        console.log('StorageService');
    }

    public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }

    async login(user: any) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.post<any>(`${clinic[name].apiUrl}/authPatient`, user)
            .pipe(
                map((res_1) => {
                  console.log('pipe', res_1);
                    if (res_1 && res_1.token) {
                        this.token = res_1.token;
                        this.currentUserSubject.next(this.getUserFromToken());
                        localStorage.setItem('access_token', res_1.token);
                        this.storage.setObject('patient_info', res_1.personne);
                    }
                    return res_1;
                })
            ).toPromise();
    }

    private decodeToken(token: string): any {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(atob(base64));
    }

    get token(): string | null {
        return localStorage.getItem('access_token');
    }

    set token(token: string | null) {
        token != null
            ? localStorage.setItem(AuthService.TOKEN_NAME, token)
            : localStorage.removeItem(AuthService.TOKEN_NAME);
    }

    getUserFromToken(): any | null {
        return this.token ? this.decodeToken(this.token).sub : null;
    }

    logOut() {
        localStorage.removeItem('access_token');
        this.token = null;
        this.currentUserSubject.next(null);
    }

    async registerUser(user: any) {
        const name: any = await this.storage.getObject('clinic');
        console.log('name',name);
        return this.http.post(`${clinic[name].apiUrl}/register`, user).toPromise();
    }

    async getPatientInfo() {
        const name: any = await this.storage.getObject('clinic');
        return JSON.parse(localStorage.getItem('patient_info')).toPromise();
    }

    async getContact(idPatient) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get(`${clinic[name].apiUrl}/Contact/${idPatient}`).toPromise();
    }

    async getNextIdContact() {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get(`${clinic[name].apiUrl}/getNextIdContact`).toPromise();
    }

    async updateContact(contact: any) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.put(`${clinic[name].apiUrl}/updateContact`, contact).toPromise();
    }

    async insertContact(contact: any) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.post(`${clinic[name].apiUrl}/Insert/addContact/`, contact).toPromise();
    }

    async getPatientsRelatedToAccount(email: string) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get(`${clinic[name].apiUrl}/getPatientsRelatedToAccount?email=${email}`).toPromise();
    }

    async forgottePasswordWithMail(email: string) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get(`${clinic[name].apiUrl}/forgottenPasswordMail?email=${email}`).toPromise();
    }

    async passwordReset(resetpassw: string, password: string) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get(`${clinic[name].apiUrl}/resetPassword?oldPass=${resetpassw}&password=${password}`).toPromise();
    }

    async  getAllPays() {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get(`${clinic[name].apiUrl}/get_all_pays`).toPromise();
    }

    async  getPaysById(idPays) {
        const name: any = await this.storage.getObject('clinic');
        return this.http.get(`${clinic[name].apiUrl}/get_pays_by_id/${idPays}`).toPromise();
    }


}
