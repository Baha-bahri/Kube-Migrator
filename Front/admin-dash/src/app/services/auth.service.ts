
import { User } from '../models/user';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8090';

  constructor(private http: HttpClient) { }

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('username', response.username);
        })
      );
  }

  signup(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
    
  }

  initiatePasswordReset(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reset-password/${email}`);
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('Token'); 
  }
 
  getToken(): string | null {
    const token = localStorage.getItem('Token');
    console.log('Retrieved Token:', token); 
    return token;
  }
  
}

