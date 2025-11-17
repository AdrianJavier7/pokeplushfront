import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ComunService} from './comun.service';
import {Registro} from '../modelos/Registro';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private apiUrl: string = localStorage.getItem('apiUrl') || 'http://localhost:8080';
  private apiUrl2 = '/auth/enviarEmail';
  private authState = new BehaviorSubject<boolean>(!!sessionStorage.getItem('authToken'));

  constructor(private http: HttpClient, private comunService: ComunService) { }

  setAuthState(isAuthenticated: boolean): void {
    this.authState.next(isAuthenticated);
  }

  registrarUsuario(registro: Registro): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/auth/registro`,registro) ;
  }

  enviarEmail(user: { email: string; password: string }): Observable<any> {
    const options = {
      ...this.comunService.autorizarPeticion(),
      responseType: 'text' as 'json'
    };
    return this.http.post<any>(`${this.apiUrl + this.apiUrl2}`, user, options);
  }


}
