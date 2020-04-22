import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import { CoConstraintGroupService } from '../../services/co-constraint-group.service';

@Component({
  selector: 'app-co-constraint-group-selector',
  templateUrl: './co-constraint-group-selector.component.html',
  styles: [],
})
export class CoConstraintGroupSelectorComponent implements OnInit {

  groups$: Observable<IDisplayElement[]>;
  segment: IDisplayElement;
  selected: IDisplayElement[];
  documentRef: IDocumentRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ccGroupService: CoConstraintGroupService,
    public dialogRef: MatDialogRef<CoConstraintGroupSelectorComponent>) {
    this.segment = data.segment;
    this.selected = [];
    this.documentRef = data.documentRef;
    /// TODO Handle library case
    this.groups$ = this.ccGroupService.getByBaseSegment(this.segment.id, this.documentRef.documentId);
  }

  ngOnInit() {
  }

}
