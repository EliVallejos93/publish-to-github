import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LongitudLatitudService {
  constructor(private http: HttpClient) { }

  get(provincia: string) {
    return this.http.get<any>(`http://api.openweathermap.org/geo/1.0/direct?appid=383d6ade07b0c2daa0d30b7b8dedf20c&q=${provincia}`).pipe(tap(
      (res: any) => { return res; }));
  }
}
