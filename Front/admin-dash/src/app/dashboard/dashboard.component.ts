import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { VeleroService } from '../services/velero.service';
import { BackupService } from '../services/backup.service';
import { CredentialService } from '../services/credential.service';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalUsers: number = 0;
  totalBackups: number = 0;
  totalVeleros: number = 0;
  totalCredentials: number = 0;
  totalProjects: number = 0;

  constructor(
    private userService: UserService,
    private veleroService: VeleroService,
    private backupService: BackupService,
    private credentialService: CredentialService,
    private projectService: ProjectService,
   
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.userService.getUsers().subscribe(users => {
      this.totalUsers = users.length;
    });

    this.veleroService.getAllVeleros().subscribe(veleros => {
      this.totalVeleros = veleros.length;
    });

    this.credentialService.getall().subscribe(credentials => {
      this.totalCredentials = credentials.length;
    
    });
    this.projectService.getall().subscribe(projects=>{
      this.totalProjects = projects.length;
    })
    
    

   this.backupService.getall().subscribe(backups=>{
    this.totalBackups = backups.length; 
   })
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}
