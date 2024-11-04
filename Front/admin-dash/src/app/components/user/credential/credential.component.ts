import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CredentialService } from '../../../services/credential.service';
import { AuthService } from '../../../services/auth.service';
import { Credential } from '../../../models/credential';

@Component({
  selector: 'app-credential',
  templateUrl: './credential.component.html',
  styleUrls: ['./credential.component.scss']
})
export class CredentialComponent implements OnInit {
  credentials: Credential[] = [];
  credentialForm!: FormGroup;
  username!: string | null;

  @ViewChild('credentialDialog') credentialDialog!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private credentialService: CredentialService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.credentialForm = this.fb.group({
      cred_name: ['', Validators.required],
      azure_backup_ressource_group: ['', Validators.required],
      azure_storage_account_id: ['', Validators.required],
      blob_container: ['', Validators.required],
      account_access_key: ['', Validators.required],
      azure_cloud_name: ['', Validators.required]
    });

    this.username = this.authService.getUsername();
    if (this.username === null) {
      console.error('User name is not available.');
    } else {
      console.log('User name => ' + this.username)
    }

    this.getAllCredentials();
  }

  getAllCredentials(): void {
    this.credentialService.getAllCredentials().subscribe(
      (data) => {
        this.credentials = data;
      },
      (error) => {
        console.error('Error fetching credentials', error);
      }
    );
  }

  openCredentialDialog(): void {
    const dialogRef = this.dialog.open(this.credentialDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllCredentials();
      }
    });
  }

  onCreateCredential(): void {
    if (this.username !== null && this.credentialForm.valid) {
      const newCredential = this.credentialForm.value;

      this.credentialService.createCredential(newCredential, this.username).subscribe(
        (createdCredential) => {
          this.dialog.closeAll();
          this.credentials.push(createdCredential);
          this.credentialForm.reset();
        },
        (error) => {
          console.error('Error creating credential', error);
        }
      );
    } else {
      console.error('User ID is not available or form is invalid');
    }
  }

  deleteCredential(event: MouseEvent, id_cred: number | undefined): void {
    event.stopPropagation(); // Prevents event propagation to the expansion panel
    if (id_cred !== undefined) {
      this.credentialService.deleteCredential(id_cred).subscribe(
        () => {
          this.credentials = this.credentials.filter(credential => credential.id_cred !== id_cred);
        },
        (error) => {
          console.error('Error deleting credential', error);
        }
      );
    }
  }
}
