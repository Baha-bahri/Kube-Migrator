import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnsibleService } from '../../../services/ansible.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-velero-setup',
  templateUrl: './velero-setup.component.html',
  styleUrls: ['./velero-setup.component.scss']
})
export class VeleroSetupComponent implements OnInit {
  veleroForm: FormGroup;
  response: string = '';
  loading = false;

  constructor(private fb: FormBuilder, private ansibleService: AnsibleService,private _snackBar: MatSnackBar) {
    this.veleroForm = this.fb.group({
      user: [''],
      ssh_key: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.veleroForm.valid) {
      this.loading = true;
      const ssh_key = this.veleroForm.get('ssh_key')?.value;
      const user = this.veleroForm.get('user')?.value;

      this.ansibleService.sshSetup(ssh_key, user).subscribe(
        response => {
          this.response = response;
          console.log('Playbook execution response:', response);
          this.loading = false;
        },
        error => {
          this.response = 'Error: ' + error.message;
          console.error('Error running playbook:', error);
          console.log('SSH Key:', ssh_key);
          this.loading = false;
          this._snackBar.open('Your SSH Key sent successfully!', 'Dismiss', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['mat-snackbar-success'],
            duration: 20000
          });
          
        }

      );
    } else {
      this.response = 'Form is invalid';
      console.error('Form is invalid');
    }
  }
}
