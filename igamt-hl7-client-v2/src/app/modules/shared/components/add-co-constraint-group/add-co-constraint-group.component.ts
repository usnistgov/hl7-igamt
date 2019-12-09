import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ICreateCoConstraintGroup } from '../../../ig/models/toc/toc-operation.class';
import { IDisplayElement } from '../../models/display-element.interface';

@Component({
  selector: 'app-add-co-constraint-group',
  templateUrl: './add-co-constraint-group.component.html',
  styleUrls: ['./add-co-constraint-group.component.scss'],
})
export class AddCoConstraintGroupComponent implements OnInit {

  model: ICreateCoConstraintGroup;
  segments: IDisplayElement[];
  selected: IDisplayElement;

  constructor(
    public dialogRef: MatDialogRef<AddCoConstraintGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.segments = data.segments;
    this.selected = this.segments.find((elm) => elm.id === data.baseSegment);
    this.model = {
      baseSegment: data.baseSegment,
      name: '',
    };
  }

  modelChange($event: IDisplayElement) {
    this.model.baseSegment = $event.id;
  }

  submit() {
    this.dialogRef.close(this.model);
  }

  cancel() {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
