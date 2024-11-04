import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BackupService } from '../../../services/backup.service';
import { Backup } from '../../../models/backup';
import { Project } from '../../../models/project';
import { ProjectService } from '../../../services/project.service';
import { AnsibleService } from '../../../services/ansible.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.scss']
})
export class BackupComponent implements OnInit {
  backups: Backup[] = [];
  ansibleCreateBackupForm!: FormGroup;
  backupForm!: FormGroup;
  deployForm!: FormGroup;
  pvcForm!: FormGroup;
  migrateForm!: FormGroup;
  deleteForm!: FormGroup;
  dialogRef!: MatDialogRef<any, any>;
  projects: Project[] = [];
  response: string = '';
  loadingBackup: boolean = false;
  selectedBackup: Backup | null = null;

  @ViewChild('createBackupModal') createBackupModal!: TemplateRef<any>;
  @ViewChild('createBackupForAllModal') createBackupForAllModal!: TemplateRef<any>;
  @ViewChild('createBackupForDeployModal') createBackupForDeployModal!: TemplateRef<any>;
  @ViewChild('createBackupForPvPvcModal') createBackupForPvPvcModal!: TemplateRef<any>;
  @ViewChild('migrateBackupModal') migrateBackupModal!: TemplateRef<any>;
  @ViewChild('deleteBackupModal') deleteBackupModal!: TemplateRef<any>;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private backupService: BackupService,
    private ansibleService: AnsibleService,
    private projectService: ProjectService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.backupForm = this.fb.group({
      back_name: [''],
      namespace_name: [''],
      deploy: [''],
      pv: [''],
      pvc: [''],
      key_backup: [''],
      value: [''],
      project_id: 0,
      dynamicHost: [''],
      context_name: [''],
      user: ['']
    });
    this.ansibleCreateBackupForm = this.fb.group({
      back_name: [''],
      context_name: [''],
      dynamicHost: [''],
      user: [''],
      project_id: 0,
    });
    this.deployForm = this.fb.group({
      back_name: [''],
      context_name: [''],
      dynamicHost: [''],
      user: [''],
      project_id: 0,
    });
    this.pvcForm = this.fb.group({
      back_name: [''],
      context_name: [''],
      dynamicHost: [''],
      user: [''],
      project_id: 0,
    });
    this.migrateForm = this.fb.group({
      dynamicHost: [''],
      user: [''],
      context_name: ['']
    });
    this.deleteForm = this.fb.group({
      dynamicHost: [''],
      user: [''],
      context_name: ['']
    });



    this.getAllBackups();
    this.getAllProjects();
  }

  openCreateBackupModal(): void {
    this.dialogRef = this.dialog.open(this.createBackupModal, {
      width: '400px'
    });
  }
  openCreateBackupForAllModal(): void {
    this.dialogRef = this.dialog.open(this.createBackupForAllModal, {
      width: '400px'
    });
  }
  openCreateBackupForDeployModal(): void {
    this.dialogRef = this.dialog.open(this.createBackupForDeployModal, {
      width: '400px'
    });
  }
  openCreateBackupForPvPvcModal(): void {
    this.dialogRef = this.dialog.open(this.createBackupForPvPvcModal, {
      width: '400px'
    });
  }
  openMigrateBackupModal(backup: Backup): void {
    if (backup) {
      this.selectedBackup = backup;
      console.log('Selected backup ID:', this.selectedBackup?.back_id);
      this.dialogRef = this.dialog.open(this.migrateBackupModal, {
        width: '400px'
      });
    } else {
      console.error('Error: No backup selected');
    }
  }
  openDeleteBackupModal(backup: Backup): void {
    if (backup) {
      this.selectedBackup = backup;
      this.dialogRef = this.dialog.open(this.deleteBackupModal, {
        width: '400px'
      });
    } else {
      console.error('Error: No backup selected');
    }
  }
  closeDialog(): void {
    if (!this.loadingBackup && this.dialogRef) {
      this.dialogRef.close();
    }
  }

  getAllBackups(): void {
    this.backupService.getAllBackups().subscribe(
      (backups) => this.backups = backups,
      (error) => console.error('Error fetching backups', error)
    );
  }

  getAllProjects(): void {
    this.projectService.getProjects().subscribe(
      (projects) => this.projects = projects,
      (error) => console.error('Error fetching projects', error)
    );
  }

  createBackup(): void {
    if (this.backupForm.valid && this.backupForm.controls['project_id'].value !== 0) {
      const { back_name, namespace_name, deploy, pv, pvc, key_backup, value, project_id } = this.backupForm.value;
      const newBackup: Backup = { back_name, namespace_name, deploy, pv, pvc, key_backup, value, project_id };

      this.backupService.createBackup(newBackup, project_id).subscribe(
        (createdBackup) => {
          this.backups.push(createdBackup);
          this.closeDialog();
          this.backupForm.reset();
        },
        (error) => console.error('Error creating backup', error)
      );
    }
  }
  createBackupAll(): void {
    if (this.ansibleCreateBackupForm.valid) {
      const { back_name, namespace_name, deploy, pv, pvc, key_backup, value, project_id } = this.ansibleCreateBackupForm.value;
      const newBackup: Backup = { back_name, namespace_name, deploy, pv, pvc, key_backup, value, project_id };

      this.backupService.createBackup(newBackup, project_id).subscribe(
        (createdBackup) => {
          this.backups.push(createdBackup);
          this.closeDialog();
          this.ansibleCreateBackupForm.reset();
        },
        (error) => console.error('Error creating backup', error)
      );
    }}
    createBackupDeploy(): void {
      if (this.deployForm.valid) {
        const { back_name, namespace_name, deploy, pv, pvc, key_backup, value, project_id } = this.deployForm.value;
        const newBackup: Backup = { back_name, namespace_name, deploy, pv, pvc, key_backup, value, project_id };

        this.backupService.createBackup(newBackup, project_id).subscribe(
          (createdBackup) => {
            this.backups.push(createdBackup);
            this.closeDialog();
            this.deployForm.reset();
          },
          (error) => console.error('Error creating backup', error)
        );
      }}
      createBackupPvPvc(): void {
        if (this.pvcForm.valid) {
          const { back_name, namespace_name, deploy, pv, pvc, key_backup, value, project_id } = this.pvcForm.value;
          const newBackup: Backup = { back_name, namespace_name, deploy, pv, pvc, key_backup, value, project_id };

          this.backupService.createBackup(newBackup, project_id).subscribe(
            (createdBackup) => {
              this.backups.push(createdBackup);
              this.closeDialog();
              this.pvcForm.reset();
            },
            (error) => console.error('Error creating backup', error)
          );
        }}
  ansiblecreatebackup(): void {
    if (this.backupForm.valid) {
      this.loadingBackup = true;
      const dynamicHost = this.backupForm.get('dynamicHost')?.value;
      const user = this.backupForm.get('user')?.value;
      const backName = this.backupForm.get('back_name')?.value;
      const namespaceName = this.backupForm.get('context_name')?.value;
      const contextName = this.backupForm.get('namespace_name')?.value;
      const projectId = this.backupForm.get('project_id')?.value;

      this.ansibleService.ansibleCreateBackup(dynamicHost, user, projectId, backName, contextName, namespaceName).subscribe(
        response => {
          this.response = response;
          console.log('Playbook execution response:', response);
          this.loadingBackup = false;
          this.createBackup();
        },
        error => {
          this.response = 'Error: ' + error.message;
          console.error('Error running playbook:', error);
          this.loadingBackup = false;

          let errorMessage = 'Unknown error';
          if (error.status === 200) {
            const successMessage = 'Successfuly Created.';
            this.createBackup();
            this._snackBar.open(successMessage, 'Close', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['mat-snackbar-success'],
              duration: 10000
            });
          }
          else
          { if (error.status === 504) {
            errorMessage = 'Gateway Timeout: make sure that the device is on.';
          } else if (error.status === 403) {
            errorMessage = 'Forbidden: Could not match supplied host pattern.';
          } else if (error.status === 417) {
            errorMessage = 'Expectation Failed: Some tasks failed during execution.';
          }


          this._snackBar.open('Error: ' + errorMessage, 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['mat-snackbar-error'],
            duration: 10000
          });
        }
          this.closeDialog();
          this.getAllBackups();
        }
      );
    } else {
      this.response = 'Form is invalid';
      console.error('Form is invalid');
    }
  }

  ansiblecreatebackupforall(): void {
    if (this.ansibleCreateBackupForm.valid) {
      this.loadingBackup = true;
      const dynamicHost = this.ansibleCreateBackupForm.get('dynamicHost')?.value;
      const user = this.ansibleCreateBackupForm.get('user')?.value;
      const backName = this.ansibleCreateBackupForm.get('back_name')?.value;
      const ContextName = this.ansibleCreateBackupForm.get('context_name')?.value;
      const projectId = this.ansibleCreateBackupForm.get('project_id')?.value;

      this.ansibleService.CreateBackupForAll(dynamicHost, user, projectId, backName,ContextName).subscribe(
        response => {
          this.response = response;
          console.log('Playbook execution response:', response);
          this.loadingBackup = false;
          this.createBackup();
        },
        error => {
          this.response = 'Error: ' + error.message;
          console.error('Error running playbook:', error);
          this.loadingBackup = false;

          let errorMessage = 'Unknown error';
          if (error.status === 200) {
            const successMessage = 'Successfuly Created.';
            this.createBackupAll();
            this._snackBar.open(successMessage, 'Close', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['mat-snackbar-success'],
              duration: 10000
            });
          }
          else
          { if (error.status === 504) {
            errorMessage = 'Gateway Timeout: make sure that the device is on.';
          } else if (error.status === 403) {
            errorMessage = 'Forbidden: Could not match supplied host pattern.';
          } else if (error.status === 417) {
            errorMessage = 'Expectation Failed: Some tasks failed during execution.';
          }


          this._snackBar.open('Error: ' + errorMessage, 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['mat-snackbar-error'],
            duration: 10000
          });
        }
          this.closeDialog();
          this.getAllBackups();
        }
      );
    } else {
      this.response = 'Form is invalid';
      console.error('Form is invalid');
    }
  }

  ansiblecreatebackupfordeploy(): void {
    if (this.deployForm.valid) {
      this.loadingBackup = true;
      const dynamicHost = this.deployForm.get('dynamicHost')?.value;
      const user = this.deployForm.get('user')?.value;
      const backName = this.deployForm.get('back_name')?.value;
      const contextName = this.deployForm.get('context_name')?.value;
      const projectId = this.deployForm.get('project_id')?.value;

      this.ansibleService.CreateBackupForDeploy(dynamicHost, user, projectId, backName, contextName).subscribe(
        response => {
          this.response = response;
          console.log('Playbook execution response:', response);
          this.loadingBackup = false;
          this.createBackupDeploy();
        },
        error => {
          this.response = 'Error: ' + error.message;
          console.error('Error running playbook:', error);
          this.loadingBackup = false;

          let errorMessage = 'Unknown error';
          if (error.status === 200) {
            const successMessage = 'Successfuly Created.';
            this.createBackupDeploy();
            this._snackBar.open(successMessage, 'Close', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['mat-snackbar-success'],
              duration: 10000
            });
          }
          else
          { if (error.status === 504) {
            errorMessage = 'Gateway Timeout: make sure that the device is on.';
          } else if (error.status === 403) {
            errorMessage = 'Forbidden: Could not match supplied host pattern.';
          } else if (error.status === 417) {
            errorMessage = 'Expectation Failed: Some tasks failed during execution.';
          }


          this._snackBar.open('Error: ' + errorMessage, 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['mat-snackbar-error'],
            duration: 10000
          });
        }
          this.closeDialog();
          this.getAllBackups();
        }
      );
    } else {
      this.response = 'Form is invalid';
      console.error('Form is invalid');
    }
  }

  ansiblecreatebackupforpvpvc(): void {
    if (this.pvcForm.valid) {
      this.loadingBackup = true;
      const dynamicHost = this.pvcForm.get('dynamicHost')?.value;
      const user = this.pvcForm.get('user')?.value;
      const backName = this.pvcForm.get('back_name')?.value;
      const contextName = this.pvcForm.get('context_name')?.value;
      const projectId = this.pvcForm.get('project_id')?.value;

      this.ansibleService.CreateBackupForPvPvc(dynamicHost, user, projectId, backName, contextName).subscribe(
        response => {
          this.response = response;
          console.log('Playbook execution response:', response);
          this.loadingBackup = false;
          this.createBackupPvPvc();
        },
        error => {
          this.response = 'Error: ' + error.message;
          console.error('Error running playbook:', error);
          this.loadingBackup = false;

          let errorMessage = 'Unknown error';
          if (error.status === 200) {
            const successMessage = 'Successfuly Created.';
            this.createBackupPvPvc();
            this._snackBar.open(successMessage, 'Close', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['mat-snackbar-success'],
              duration: 10000
            });
          }
          else
          { if (error.status === 504) {
            errorMessage = 'Gateway Timeout: make sure that the device is on.';
          } else if (error.status === 403) {
            errorMessage = 'Forbidden: Could not match supplied host pattern.';
          } else if (error.status === 417) {
            errorMessage = 'Expectation Failed: Some tasks failed during execution.';
          }


          this._snackBar.open('Error: ' + errorMessage, 'Close', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['mat-snackbar-error'],
            duration: 10000
          });
        }
          this.closeDialog();
          this.getAllBackups();
        }
      );
    } else {
      this.response = 'Form is invalid';
      console.error('Form is invalid');
    }
  }

  migrateBackup(): void {
    if (this.migrateForm.valid && this.selectedBackup) {
      this.loadingBackup = true;
      const dynamicHost = this.migrateForm.get('dynamicHost')?.value;
      const user = this.migrateForm.get('user')?.value;
      const contextName = this.migrateForm.get('context_name')?.value;
      const backupId = this.selectedBackup.back_id;

      if (backupId !== undefined) {
        this.ansibleService.ansibelmigrateBackup(dynamicHost, user, backupId, contextName).subscribe(
          response => {
            this.response = response;
            console.log('Playbook execution response:', response);
            this.loadingBackup = false;
          },
          error => {
            this.response = 'Error: ' + error.message;
            console.error('Error running playbook:', error);
            this.loadingBackup = false;

            let errorMessage = 'Unknown error';
            if (error.status === 200) {
              const successMessage = 'Successfuly migrated.';
              this._snackBar.open(successMessage, 'Close', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['mat-snackbar-success'],
                duration: 10000
              });
            }
            else
            { if (error.status === 504) {
              errorMessage = 'Gateway Timeout: make sure that the device is on.';
            } else if (error.status === 403) {
              errorMessage = 'Forbidden: Could not match supplied host pattern.';
            } else if (error.status === 417) {
              errorMessage = 'Expectation Failed: Some tasks failed during execution.';
            }


            this._snackBar.open('Error: ' + errorMessage, 'Close', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['mat-snackbar-error'],
              duration: 10000
            });
          }
            this.closeDialog();
            this.getAllBackups();
          }
        );
      } else {
        this.response = 'Form is invalid';
        console.error('Form is invalid');
      }
    }
  }
  ansibledeleteBackup(): void {
    if (this.deleteForm.valid && this.selectedBackup) {
      this.loadingBackup = true;
      const dynamicHost = this.deleteForm.get('dynamicHost')?.value;
      const user = this.deleteForm.get('user')?.value;
      const context_name = this.deleteForm.get('context_name')?.value;
      const backup_id = this.selectedBackup.back_id;

      if (backup_id !== undefined) {
        this.ansibleService.ansibeldeleteBackup(dynamicHost, user, backup_id, context_name).subscribe(
          response => {
            this.response = response;
            console.log('Playbook execution response:', response);
            this.loadingBackup = false;
            this.deleteBackup(backup_id);
          },
          error => {
            this.response = 'Error: ' + error.message;
            console.error('Error running playbook:', error);
            this.loadingBackup = false;

            let errorMessage = 'Unknown error';
            if (error.status === 200) {
              const successMessage = 'Successfuly Deleted.';
              this.deleteBackup(backup_id);
              this._snackBar.open(successMessage, 'Close', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['mat-snackbar-success'],
                duration: 10000
              });
            }
            else
            { if (error.status === 504) {
              errorMessage = 'Gateway Timeout: make sure that the device is on.';
            } else if (error.status === 403) {
              errorMessage = 'Forbidden: Could not match supplied host pattern.';
            } else if (error.status === 417) {
              errorMessage = 'Expectation Failed: Some tasks failed during execution.';
            }


            this._snackBar.open('Error: ' + errorMessage, 'Close', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['mat-snackbar-error'],
              duration: 10000
            });
          }
            this.closeDialog();
            this.getAllBackups();
          }
        );
      } else {
        this.response = 'Form is invalid';
        console.error('Form is invalid');
      }
    }
  }


  deleteBackup(id: number): void {
    this.backupService.deleteBackup(id).subscribe(
      () => {
        console.log(`Backup with ID ${id} deleted successfully`);
        this.backups = this.backups.filter(backup => backup.back_id !== id);
      },
      (error) => {
        console.error(`Error deleting backup with ID ${id}:`, error);
      }
    );
  }

  getProjectForBackup(backup: Backup): void {
    this.projectService.getProjects().subscribe(
      (projects) => {
        const project = projects.find(p => p.project_id === backup.project_id);
      },
      (error) => console.error(`Error fetching project for backup ID ${backup.back_id}`, error)
    );
  }
  selectBackup(backup: Backup) {
    this.selectedBackup = backup;
  }

  createBackups(): void {
      this.ansiblecreatebackup();
  }

  createBackupsForAll(): void {
    this.ansiblecreatebackupforall();
  }
  createBackupsForDeploy(): void {
    this.ansiblecreatebackupfordeploy();
  }
  createBackupsForPvPvc(): void {
    this.ansiblecreatebackupforpvpvc();
  }

  deleteBackups(): void {
    if (this.selectedBackup) {
      this.ansibledeleteBackup();
    } else {
      console.error('No backup selected for deletion.');
    }
  }
}