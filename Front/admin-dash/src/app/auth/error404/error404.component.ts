import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.scss']
})
export class Error404Component implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }
  
 
  goHome() {
    const username = this.authService.getUsername();
    if (username === 'admin') {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/user-home']);
    }
  }  
  }

