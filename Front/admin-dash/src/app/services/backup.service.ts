import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Backup } from '../models/backup'; 

@Injectable({
  providedIn: 'root'
})
export class BackupService {
  private apiUrl = 'http://localhost:8090/backups';

  constructor(private http: HttpClient) { }

  getAllBackups(): Observable<Backup[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('Token')}`);
    return this.http.get<Backup[]>(this.apiUrl, { headers: headers });
  }

  createBackup(backup: Backup, projectId: number): Observable<Backup> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('Token')}`);
    const url = `${this.apiUrl}/${projectId}`;
    return this.http.post<Backup>(url, backup, { headers: headers });
  }
  deleteBackup(id: number): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('Token')}`);
    const deleteUrl = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(deleteUrl, { headers: headers });
  }
  getall(): Observable<Backup[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('Token')}`);
    return this.http.get<Backup[]>(`${this.apiUrl}/all`, { headers: headers });
  }

}
