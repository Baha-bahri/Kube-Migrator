import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Credential } from '../models/credential';

@Injectable({
  providedIn: 'root'
})
export class CredentialService {
  private apiUrl = 'http://localhost:8090/credentials';

  constructor(private http: HttpClient) {}
  getAllCredentials(): Observable<Credential[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('Token')}`);
    return this.http.get<Credential[]>(`${this.apiUrl}`, { headers: headers });
  }

  createCredential(credential: Credential, username: string): Observable<Credential> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('Token')}`)
    return this.http.post<Credential>(`${this.apiUrl}/${username}`, credential, { headers: headers });
  }
  deleteCredential(id: number): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('Token')}`);
    const deleteUrl = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(deleteUrl, { headers: headers });
  }
  getall(): Observable<Credential[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('Token')}`);
    return this.http.get<Credential[]>(`${this.apiUrl}/all`, { headers: headers });
  }
}
