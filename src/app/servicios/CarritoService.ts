import { Injectable } from '@angular/core';
import {Comun} from './comun';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Carrito} from '../modelos/Carrito';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {

  constructor ( private http: HttpClient, private comun: Comun) { }

  getCarrito(): Observable<Carrito> {
    const options = this.comun.autorizarPeticion();
    return this.http.get<any>('http://localhost:8080/carrito/obtener', options);
  }

}
