import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {Producto} from '../modelos/Producto';
import {ComunService} from './comun.service';
import {Opiniones} from '../modelos/Opiniones';
import {Comun} from './comun';

@Injectable({
  providedIn: 'root',
})
export class opinionesService {

  private apiUrl = 'http://localhost:8080/opiniones';

  constructor ( private http: HttpClient, private comun: Comun) { }

    //Esto es para obtener todas las opis  (get/opiniones/all)
    getAll(): Observable<Opiniones> {
    return this.http.get<Opiniones>(`${this.apiUrl}/all`);
    }

    //Para obtener la opi con el ID
    getbyId(id:number): Observable<Opiniones>{
    return this.http.get<Opiniones>(`${this.apiUrl}/${id}`);
  }

  //Para crear una opi con POST
  create(opinion: Opiniones): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/crear-opinion`, opinion, this.comun.autorizarPeticion()
    );
  }

  //Para actualizr una opi con PUT
  update(id:number, opinion: Opiniones): Observable<Opiniones>{
    return this.http.put<Opiniones>(`${this.apiUrl}/${id}`, opinion, this.comun.autorizarPeticion()
    );
  }

  //Para eliminar una opi con DELETE
  delete(id:number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.comun.autorizarPeticion()
    );
  }

  //Para obtener opiniones por producto agarrando su ID
  getByProducto(productoId: number): Observable<Opiniones[]> {
    const options = this.comun.autorizarPeticion();
    return this.http.get<Opiniones[]>(`${this.apiUrl}/producto/${productoId}`, options);
  }

}
