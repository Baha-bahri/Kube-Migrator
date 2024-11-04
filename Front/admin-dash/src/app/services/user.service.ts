import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8090';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('Token')}`);
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers: headers });
  }

  deleteUser(id: number): Observable<boolean> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('Token')}`);
    return this.http.delete<boolean>(`${this.apiUrl}/users/${id}`, { headers: headers });
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  updateUser(userId: number, updatedUser: User): Observable<User> {
    const user : User = {
     username : updatedUser.username,
     email : updatedUser.email,
     password : updatedUser.password,
     phone : updatedUser.phone
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('Token')}`);
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, user, { headers: headers });
  }
  
  findUserByUsername(username: string): Observable<User> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('Token')}`);
    return this.http.get<User>(`${this.apiUrl}/users/username/${username}`, { headers: headers });
  }
}
