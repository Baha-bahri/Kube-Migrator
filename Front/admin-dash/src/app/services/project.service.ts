import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8090/projects';

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('Token')}`);
    return this.http.get<Project[]>(this.apiUrl, { headers: headers });
  }
  getall(): Observable<Project[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('Token')}`);
    return this.http.get<Project[]>(`${this.apiUrl}/all`, { headers: headers });
  }
  createProject(project: Project, idCredential: number, veleroVersion: string): Observable<Project> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('Token')}`);
    return this.http.post<Project>(`${this.apiUrl}/${idCredential}/${veleroVersion}`, project, { headers: headers });
  }

  updateProject(id: number | undefined, project: Project): Observable<Project> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('Token')}`);
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project, { headers: headers });
  }

  deleteProject(id: number): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('Token')}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: headers });
  }
}
