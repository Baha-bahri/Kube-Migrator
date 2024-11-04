import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VeleroService } from '../../../services/velero.service';
import { Velero } from '../../../models/velero';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-velero-download',
  templateUrl: './velero-download.component.html',
  styleUrls: ['./velero-download.component.scss']
})
export class VeleroDownloadComponent implements OnInit {
  @ViewChild('veleroSetupModal') veleroSetupModal!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any, any>;
  veleros: Velero[] = [];
  veleroForm!: FormGroup;

  constructor(public dialog: MatDialog, private veleroService: VeleroService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadVeleros();
    this.veleroForm = this.fb.group({
      velero_version: ['', Validators.required],
      velero_bin: ['', Validators.required],
      velero_url: ['', Validators.required],
      velero_pkg: ['', Validators.required],
      velero_pkg_bin: ['', Validators.required],
      velero_pkg_ext: ['', Validators.required]
    });
  }

  loadVeleros(): void {
    this.veleroService.getAllVeleros().subscribe((data: Velero[]) => {
      this.veleros = data;
    });
  }

  openVeleroSetupModal(): void {
    this.dialogRef = this.dialog.open(this.veleroSetupModal, {
      width: '400px'
    });
  }

  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  createVelero(): void {
    if (this.veleroForm.valid) {
      this.veleroService.createVelero(this.veleroForm.value).subscribe(() => {
        this.loadVeleros();
        this.closeDialog();
        this.veleroForm.reset();
      });
    }
  }

  deleteVelero(version: string): void {
    this.veleroService.deleteVelero(version).subscribe(() => {
      this.loadVeleros();
    });
  }
}
