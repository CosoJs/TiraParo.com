import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NominatimService {
  private apiUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) {}

  searchAddress(query: string): Observable<any> {
    const url = `${this.apiUrl}?q=${encodeURIComponent(query)}&format=json&addressdetails=1&countrycodes=MX`; // Agregamos el filtro de país
    return this.http.get(url);
  }
}
