import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  login(credentials: { username: string; password: string }) {
    this.authService.login(credentials).subscribe(
      (response: any) => {
        const username = response.username;
        if (username === 'admin') {
          localStorage.setItem("Token",response.token)
          this.router.navigate(['/home']);
        } else {
          localStorage.setItem("Token",response.token)
          this.router.navigate(['/user-home']);
        }
      },
      (error) => {
        console.error('Error during login:', error);
        alert('Invalid username or password');
      }
    );
  }
  

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
