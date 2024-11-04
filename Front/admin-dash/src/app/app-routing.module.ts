import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './dashboard/dashboard-components/product/product.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FullComponent } from './layouts/full/full.component';
import { UsersComponent } from './components/admin/users/users.component';
import { ProjectComponent } from './components/user/project/project.component';
import { BackupComponent } from './components/user/backup/backup.component';
import { CredentialComponent } from './components/user/credential/credential.component';
import { VeleroSetupComponent } from './components/user/velero-setup/velero-setup.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { VeleroDownloadComponent } from './components/admin/velero-download/velero-download.component';
import { LoginComponent } from './auth/login/login.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component'; 
import { SignupComponent } from './auth/signup/signup.component';
import { Error404Component } from './auth/error404/error404.component';
import { UserHomeComponent } from './components/user/user-home/user-home.component';
import { AuthGuard } from './guard/auth.guard';
import { UnauthenticatedGuard  } from './guard/unauthenticated-guard.guard';
import { AdminGuard } from './guard/admin.guard';
import { UserGuard } from './guard/user.guard';

const routes: Routes = [
  {
    path: '',

    component: FullComponent,
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: DashboardComponent , canActivate: [AuthGuard,AdminGuard] },
      { path : 'user-home', component : UserHomeComponent ,canActivate : [AuthGuard,UserGuard]},
      { path : 'project', component : ProjectComponent ,canActivate : [AuthGuard,UserGuard]},
      { path : 'backup', component : BackupComponent ,canActivate : [AuthGuard,UserGuard]},
      { path : 'credential', component : CredentialComponent ,canActivate : [AuthGuard,UserGuard]},
      { path : 'velero-setup', component : VeleroSetupComponent ,canActivate : [AuthGuard,UserGuard]},
      { path : 'profile', component : ProfileComponent ,canActivate : [AuthGuard,UserGuard]},
      { path: 'user', component: UsersComponent, canActivate: [AuthGuard,AdminGuard] },
      { path: 'velero-download', component: VeleroDownloadComponent, canActivate: [AuthGuard,AdminGuard] },
      { path: 'table', component: ProductComponent },
    ]
  },
  { path: 'login', component: LoginComponent ,canActivate: [UnauthenticatedGuard]  },
  { path: 'signup', component: SignupComponent,canActivate: [UnauthenticatedGuard]  },
  { path: 'reset-password', component: ResetPasswordComponent,canActivate: [UnauthenticatedGuard]  },
  { path: 'error404', component: Error404Component },
{ path: 'user-home', component: UserHomeComponent, canActivate: [AuthGuard,UserGuard]},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/error404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
