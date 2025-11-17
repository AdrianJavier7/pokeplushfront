import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Producto} from '../modelos/Producto';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl= 'http://localhost:8080/api/productos';
  constructor(private http: HttpClient) { }

  getProducto(): Observable<Producto[]> {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ0b2tlbkRhdGFEVE8iOnsiZW1haWwiOiJsdWNpYUBnbWFpbC5jb20iLCJuaXZlbCI6IlVTVUFSSU8iLCJmZWNoYV9jcmVhY2lvbiI6MTc2MzE2MTU4NDI0NSwiZmVjaGFfZXhwaXJhY2lvbiI6MTc2MzE3MjM4NDI0NX19.P1qN1QdaoPaJu2IMzBf1GoGHBlXbOGSHZmSMRgoU3Lw'; // <- pega el token aquí

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Producto[]>(this.apiUrl, { headers });
  }

  getProductoPorId(id: number): Observable<Producto>{
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJ0b2tlbkRhdGFEVE8iOnsiZW1haWwiOiJsdWNpYUBnbWFpbC5jb20iLCJuaXZlbCI6IlVTVUFSSU8iLCJmZWNoYV9jcmVhY2lvbiI6MTc2MzMwNzY2OTY2MiwiZmVjaGFfZXhwaXJhY2lvbiI6MTc2MzMxODQ2OTY2Mn19.oXYiaQChSxpZVEYqXyeqJrmeR0u8JdHlAzxMXrZXvco'; // <- pega el token aquí

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Producto>(`${this.apiUrl}/${id}`, { headers });
  }

}
