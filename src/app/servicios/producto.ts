import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Producto} from '../modelos/Producto';
import {ComunService} from './comun.service';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl= 'http://localhost:8080/api/productos';
  constructor(private http: HttpClient, private comun: ComunService) { }

  getProducto(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl, this.comun.autorizarPeticion());
  }

  getProductoPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`, this.comun.autorizarPeticion());
  }
}
