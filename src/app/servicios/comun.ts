import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class Comun {
  constructor(private http: HttpClient) {
  }

  autorizarPeticion() {
    const headers:HttpHeaders = new HttpHeaders({
      //El comando de abajo da fallo porque de manera visual, lo que mandamos al backend no es en formato Json
      //'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
    });
    return { headers: headers };
  }
}
