import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {Usuario} from '../modelos/Usuario';
import {Comun} from './comun';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl: string = localStorage.getItem('apiUrl') || 'http://localhost:8080';
  private authState = new BehaviorSubject<boolean>(!!sessionStorage.getItem('authToken'))
  private usuarioSubject = new BehaviorSubject<Usuario | undefined>(undefined);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient, private comunService: Comun) {}

  setUsuario(u?: Usuario): void {
    this.usuarioSubject.next(u);
  }

  getMiPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/perfil/miPerfil`, this.comunService.autorizarPeticion())
      .pipe(tap(u => this.usuarioSubject.next(u)));
  }

  updatePerfil(usuario: Usuario, file?: File | undefined): Observable<Usuario> {
    const formData = new FormData();
    formData.append('perfil', new Blob([JSON.stringify(usuario)], { type: 'application/json' }));
    if (file) {
      formData.append('foto', file);
    }
    return this.http.post<Usuario>(`${this.apiUrl}/perfil/updatePerfil`, formData, this.comunService.autorizarPeticion())
      .pipe(tap(u => this.usuarioSubject.next(u)));
  }
}
