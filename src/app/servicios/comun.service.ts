import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class ComunService {


  constructor(private http: HttpClient) {
  }

  autorizarPeticion() {
    const headers:HttpHeaders = new HttpHeaders({
      /*'Content-Type': 'application/json',*/
      'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'),
    });

    return {headers: headers}
  }

  getUsuarioAutorizado() {
    const token = sessionStorage.getItem('authToken');

    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken;
    }
  }

}
