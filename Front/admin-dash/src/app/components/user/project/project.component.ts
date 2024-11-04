import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../../services/project.service';
import { CredentialService } from '../../../services/credential.service';
import { VeleroService } from '../../../services/velero.service';
import { Project } from '../../../models/project';
import { Credential } from '../../../models/credential';
import { Velero } from '../../../models/velero';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  projects: Project[] = [];
  credentials: Credential[] = [];
  veleros: Velero[] = [];
  projectForm!: FormGroup;
  updateProjectForm!: FormGroup;
  dialogRef!: MatDialogRef<any, any>;
  updateProjectDialogRef!: MatDialogRef<any, any>;
  projectMenuTrigger: any;
  project_id?: number;
  selectedProject: Project | null = null;

  @ViewChild('projectSetupModal') projectSetupModal!: TemplateRef<any>;
  @ViewChild('updateProjectModal') updateProjectModal!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private projectService: ProjectService,
    private credentialService: CredentialService,
    private veleroService: VeleroService
  ) { }

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      project_name: ['', Validators.required],
      id_credential: ['', Validators.required],
      velero_version: ['', Validators.required]
    });

    this.updateProjectForm = this.fb.group({
      new_project_name: ['', Validators.required]
    });

    this.getAllProjects();
    this.getAllCredentials();
    this.getAllVeleros();
  }

  openProjectSetupModal(): void {
    this.dialogRef = this.dialog.open(this.projectSetupModal, {
      width: '400px'
    });
  }

  openUpdateProjectModal(project: Project): void {
    this.project_id = project.project_id;
    this.updateProjectForm.patchValue({
      new_project_name: project.project_name
    });
    this.updateProjectDialogRef = this.dialog.open(this.updateProjectModal, {
      width: '400px'
    });
  }

  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    if (this.updateProjectDialogRef) {
      this.updateProjectDialogRef.close();
    }
  }

  getAllProjects(): void {
    this.projectService.getProjects().subscribe(
      (projects) => this.projects = projects,
      (error) => console.error('Error fetching projects', error)
    );
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

  getAllVeleros(): void {
    this.veleroService.getAllVeleros().subscribe((data: Velero[]) => {
      this.veleros = data;
    });
  }

  createProject(): void {
    if (this.projectForm.valid) {
      const { project_name, id_credential, velero_version } = this.projectForm.value;
      const newProject: Project = { project_name };

      this.projectService.createProject(newProject, id_credential, velero_version).subscribe(
        (createdProject) => {
          this.projects.push(createdProject);
          this.closeDialog();
          this.projectForm.reset();
        },
        (error) => console.error('Error creating project', error)
      );
    }
  }

  deleteProject(id: number): void {
    this.projectService.deleteProject(id).subscribe(
      () => this.projects = this.projects.filter(project => project.project_id !== id),
      (error) => console.error('Error deleting project', error)
    );
  }

  updateProject(): void {
    if (this.updateProjectForm.valid) {
      const { new_project_name } = this.updateProjectForm.value;
      this.projectService.updateProject(this.project_id, { project_name: new_project_name }).subscribe(
        (updatedProject) => {
          const index = this.projects.findIndex(project => project.project_id === this.project_id);
          if (index !== -1) {
            this.projects[index].project_name = updatedProject.project_name;
          }
          this.closeDialog();
          this.updateProjectForm.reset();
        },
        (error) => console.error('Error updating project', error)
      );
    }
  }

  selectProject(project: Project): void {
    this.selectedProject = project;
  }
}
