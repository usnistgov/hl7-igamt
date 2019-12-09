import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoConstraintEntityService } from '../../services/co-constraint-entity.service';

@Component({
  selector: 'app-narrative-header-dialog',
  templateUrl: './narrative-header-dialog.component.html',
  styleUrls: ['./narrative-header-dialog.component.scss'],
})
export class NarrativeHeaderDialogComponent implements OnInit {

  title: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ccEntityService: CoConstraintEntityService,
    public dialogRef: MatDialogRef<NarrativeHeaderDialogComponent>) {
  }

  done() {
    this.dialogRef.close(this.ccEntityService.createNarrativeHeader(this.title));
  }

  ngOnInit() {
  }

}
