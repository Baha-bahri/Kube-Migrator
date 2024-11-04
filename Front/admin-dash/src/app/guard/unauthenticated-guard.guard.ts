import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UnauthenticatedGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      const username = this.authService.getUsername();
      if (username === 'admin') {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/user-home']);
      }
      return false; 
    }
    return true; 
  }
  
}
