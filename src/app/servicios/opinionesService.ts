import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Producto} from '../modelos/Producto';
import {ComunService} from './comun.service';

@Injectable({
  providedIn: 'root',
})
export class opinionesService {

  private apiUrl = 'http://localhost:8080/opiniones';

  constructor(private http: HttpClient) {

  }
}
