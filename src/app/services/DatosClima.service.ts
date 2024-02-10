import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DatosClimaService {
  constructor(private http: HttpClient) { }

  get(lat: string, lon: string) {
    return this.http.get<any>(`https://api.tutiempo.net/json/?lan=es&apid=zsDaaaXXqaa9vbg&ll=${lat},${lon}`).pipe(tap(
      (res: any) => { return res; }));
  }
}
