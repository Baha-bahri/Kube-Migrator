import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | undefined;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', Validators.minLength(8)],
      confirmPassword: ['']
    }, { validator: this.checkPasswords });
  }

  ngOnInit(): void {
    const currentUsername = this.authService.getUsername();

    if (currentUsername) {
      this.userService.findUserByUsername(currentUsername).subscribe(user => {
        this.currentUser = user;
        if (this.currentUser) {
          this.profileForm.patchValue({
            username: this.currentUser.username,
            email: this.currentUser.email,
            phone: this.currentUser.phone
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.currentUser) {
      const updatedUser: User = {
        ...this.currentUser,
        email: this.profileForm.get('email')?.value,
        phone: this.profileForm.get('phone')?.value
      };

      const password = this.profileForm.get('password')?.value;
      if (password != "") {
        updatedUser.password = password;
      }
      else
      updatedUser.password = "";


      this.userService.updateUser(this.currentUser.user_id!, updatedUser).subscribe(
        response => {
          console.log('User updated successfully:', response);
        },
        error => {
          console.error('Error updating user:', error);
        }
      );
    }
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatch: true };
  }
}
