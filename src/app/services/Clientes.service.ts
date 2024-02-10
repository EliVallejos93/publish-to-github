import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ClientesService {
  constructor(private http: HttpClient) { }

  baseUrl = "https://localhost:7156";

  Insert(body: any) {
    return this.http.post<any>(`${this.baseUrl}/api/Clientes/Insert`, body).pipe(tap(
      (res: any) => { return res; }));
  }
  GetAll() {
    return this.http.get<any>(`${this.baseUrl}/api/Clientes/GetAll`).pipe(tap(
      (res: any) => { return res; }));
  }
  Search(nombre: any) {
    return this.http.get<any>(`${this.baseUrl}/api/Clientes/Search?nombre=${nombre}`).pipe(tap(
      (res: any) => { return res; }));
  }
  Update(body: any) {
    return this.http.post<any>(`${this.baseUrl}/api/Clientes/Update`, body).pipe(tap(
      (res: any) => { return res; }));
  }
}
