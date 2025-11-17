import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Login} from '../modelos/Login';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ComunService} from './comun.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl: string = localStorage.getItem('apiUrl') || 'http://localhost:8080';
  private authState = new BehaviorSubject<boolean>(!!sessionStorage.getItem('authToken'))
  authState$ = this.authState.asObservable();

  constructor(private http: HttpClient, private comunService: ComunService) {}

  setAuthState(isAuthenticated: boolean): void {
    this.authState.next(isAuthenticated);
  }

  loguearUsuario(login: Login): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/auth/login`,login) ;
  }

  verificarCodigo(dto: { email: string; codigo: string }): Observable<string> {
    return this.http.post(`${this.apiUrl}/auth/verificar`, dto, { responseType: 'text' });
  }

  enviarCodigoRecuperacion(email: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/auth/recuperar/enviarCodigo`, { email }, { responseType: 'text' });
  }

  cambiarContrasena(dto: { email: string; codigo: string; nuevaPassword: string }): Observable<string> {
    return this.http.post(`${this.apiUrl}/auth/recuperar/cambiar`, dto, { responseType: 'text' });
  }
}
