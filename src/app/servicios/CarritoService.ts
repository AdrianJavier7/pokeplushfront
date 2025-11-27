import { Injectable } from '@angular/core';
import {Comun} from './comun';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Carrito} from '../modelos/Carrito';
import {Item} from '../modelos/Item';

@Injectable({
  providedIn: 'root',
})

export class CarritoService {

  constructor ( private http: HttpClient, private comun: Comun) { }

  getCarrito(): Observable<Carrito> {
    const options = this.comun.autorizarPeticion();
    return this.http.get<any>('http://localhost:8080/carrito/obtener', options);
  }

  quitarItem(item: Item): Observable<Carrito> {
    const options = this.comun.autorizarPeticion();
    return this.http.post<Carrito>('http://localhost:8080/carrito/quitar', item, options);
  }

  obtenerPedidos(): Observable<Carrito[]> {
    const options = this.comun.autorizarPeticion();
    return this.http.get<Carrito[]>('http://localhost:8080/carrito/pedidos', options);
  }

  finalizarCarrito(): Observable<Carrito> {
    const options = this.comun.autorizarPeticion();
    return this.http.post<any>('http://localhost:8080/carrito/procesando', {}, options);
  }

  obtenerPedidoActual(id: number): Observable<Carrito> {
    const options = this.comun.autorizarPeticion();
    return this.http.get<any>('http://localhost:8080/carrito/obtener/' + id, options);
  }

  cancelarPedido(id: number): Observable<any> {
    const options = this.comun.autorizarPeticion();
    return this.http.post<any>('http://localhost:8080/carrito/cancelar/' + id, options);
  }

}
