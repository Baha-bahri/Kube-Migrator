import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  resetPassword() {
    this.loading = true;
    const email = this.resetPasswordForm.value.email;
    this.authService.initiatePasswordReset(email).subscribe(
      (response) => {
        if (response) {
          alert('Your new password has been sent to your email.');
          this.router.navigate(['/login']);
        } else {
          alert('Failed to initiate password reset. Please try again later.');
        }
      },
      (error) => {
        console.error('Error initiating password reset:', error);
        alert('An error occurred. Please try again later.');
      }
    ).add(() => this.loading = false); 
  }
}
