import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import * as config from '../../../../../../root-store/config/config.reducer';
import { Scope } from '../../../../../shared/constants/scope.enum';
import { IDisplayElement } from '../../../../../shared/models/display-element.interface';
import { StructureEditorService } from '../../../../services/structure-editor.service';

@Component({
  selector: 'app-resource-select-dialog',
  templateUrl: './resource-select-dialog.component.html',
  styleUrls: ['./resource-select-dialog.component.scss'],
})
export class ResourceSelectDialogComponent implements OnInit {

  hl7Version$: Observable<string[]>;
  selectedVersion: string;
  data$: Observable<IDisplayElement[]>;
  type: Type;
  label: string;
  selectedScope = Scope.HL7STANDARD;

  constructor(
    private structureEditorService: StructureEditorService,
    private store: Store<any>,
    private dialogRef: MatDialogRef<ResourceSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.hl7Version$ = this.store.select(config.getHl7Versions);
    this.type = data.type;
    this.label = _.capitalize(this.type);
  }

  getResources($event) {
    this.data$ = this.structureEditorService.getResourcesDisplay(this.type, $event.version, $event.scope).pipe(
      map((data) => {
        return data;
      }),
    );
  }

  startFrom(value) {
    this.dialogRef.close(value);
  }

  ngOnInit() {
  }

}
