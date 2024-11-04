import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { BackupService } from '../../../services/backup.service';
import { ProjectService } from '../../../services/project.service';
import { CredentialService } from '../../../services/credential.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit {
  username: string | null = null;
  totalBackups: number = 0;
  totalProjects: number = 0;
  totalCredentials: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private backupService: BackupService,
    private projectService: ProjectService,
    private credentialService: CredentialService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.backupService.getAllBackups().subscribe(backups => {
      this.totalBackups = backups.length;
    });

    this.projectService.getProjects().subscribe(projects => {
      this.totalProjects = projects.length;
    });

    this.credentialService.getAllCredentials().subscribe(credentials => {
      this.totalCredentials = credentials.length;
    });
  }

  logout(): void {
    localStorage.removeItem('Token');
    localStorage.removeItem('username');
    console.log('Logged out successfully (token and username removed)');
    this.router.navigate(['/login']);
  }
}
