import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Velero } from '../models/velero';

@Injectable({
  providedIn: 'root'
})
export class VeleroService {
  private apiUrl = 'http://localhost:8090/veleros';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('Token')}`);
  }

  getAllVeleros(): Observable<Velero[]> {
    const headers = this.getHeaders();
    return this.http.get<Velero[]>(this.apiUrl, { headers });
  }

  getVeleroByVersion(version: string): Observable<Velero> {
    const headers = this.getHeaders();
    return this.http.get<Velero>(`${this.apiUrl}/${version}`, { headers });
  }

  createVelero(velero: Velero): Observable<Velero> {
    const headers = this.getHeaders();
    return this.http.post<Velero>(this.apiUrl, velero, { headers });
  }

  updateVelero(version: string, velero: Velero): Observable<Velero> {
    const headers = this.getHeaders();
    return this.http.put<Velero>(`${this.apiUrl}/${version}`, velero, { headers });
  }

  deleteVelero(version: string): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${version}`, { headers });
  }
}
