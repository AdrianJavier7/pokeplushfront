import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Producto} from '../modelos/Producto';
import {Comun} from './comun';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl= 'http://localhost:8080/api/productos';
  constructor(private http: HttpClient, private comun: Comun) { }

  getProducto(): Observable<Producto[]> {
    const options = this.comun.autorizarPeticion();

    return this.http.get<Producto[]>(this.apiUrl, options);
  }

  getProductosPorVariosIds(listaIds: number[]): Observable<Producto[]> {
    const optionsFromComun = this.comun.autorizarPeticion() || {};
    const options = { ...optionsFromComun, responseType: 'json' as const };
    return this.http.post<Producto[]>(`${this.apiUrl}/obtenerPorVarios`, listaIds, options);
  }

  getProductoPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`, this.comun.autorizarPeticion());
  }

}
