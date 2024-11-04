import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

import { DemoFlexyModule } from '../demo-flexy-module';



import { FormsModule } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from './admin/users/users.component';
import { VeleroDownloadComponent } from './admin/velero-download/velero-download.component';
import { ProjectComponent } from './user/project/project.component';
import { ProfileComponent } from './user/profile/profile.component';
import { BackupComponent } from './user/backup/backup.component';
import { CredentialComponent } from './user/credential/credential.component';
import { VeleroSetupComponent } from './user/velero-setup/velero-setup.component';

@NgModule({
  declarations: [
  
    UsersComponent,
    VeleroDownloadComponent,
    ProjectComponent,
    ProfileComponent,
    BackupComponent,
    CredentialComponent,
    VeleroSetupComponent,
  
  
  ],
  imports: [
    CommonModule,
    FeatherModule.pick(allIcons),
    DemoFlexyModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
  ]
})
export class ComponentsModule { }
