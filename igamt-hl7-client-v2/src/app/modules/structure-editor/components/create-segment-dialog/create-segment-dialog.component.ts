import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import {Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import * as config from '../../../../root-store/config/config.reducer';
import {selectSegmentStructures} from '../../../../root-store/structure-editor/structure-editor.reducer';
import { Scope } from '../../../shared/constants/scope.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { ISegment } from '../../../shared/models/segment.interface';
import { StructureEditorService } from '../../services/structure-editor.service';

@Component({
  selector: 'app-create-segment-dialog',
  templateUrl: './create-segment-dialog.component.html',
  styleUrls: ['./create-segment-dialog.component.scss'],
})
export class CreateSegmentDialogComponent implements OnInit {

  data$: Observable<IDisplayElement[]>;
  hl7Version$: Observable<string[]>;
  selectedVersion: string;
  segmentBase: ISegment;
  identifier: string;
  description: string;
  zname: string;
  selectedScope = Scope.HL7STANDARD;
  domainInfo: any;
  existing: IDisplayElement[] = [];
  constructor(
    private structureEditorService: StructureEditorService,
    private store: Store<any>,
    private dialogRef: MatDialogRef<CreateSegmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.hl7Version$ = this.store.select(config.getHl7Versions);
    this.store.select(selectSegmentStructures).subscribe((x) => {
      this.existing = x;
    });
  }

  startFrom($event) {
    this.segmentBase = $event;
    console.log($event);
    this.description = $event.description;
    this.domainInfo = {...$event.domainInfo, scope: Scope.USERCUSTOM};
  }

  clearSelection() {
    this.segmentBase = undefined;
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close({
      from: this.segmentBase.id,
      identifier: this.identifier,
      description: this.description,
      zname: this.zname,
    });
  }

  isZSegment(name: string) {
    return name.startsWith('Z');
  }

  getSegments($event) {
    this.data$ = this.structureEditorService.getResourcesDisplay(Type.SEGMENT, $event.version, $event.scope).pipe(
      map((data) => {
        return data;
      }),
    );
  }

  ngOnInit() {
  }

}
