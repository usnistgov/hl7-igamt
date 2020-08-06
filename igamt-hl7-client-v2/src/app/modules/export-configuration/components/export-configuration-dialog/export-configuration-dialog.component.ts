import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { TreeNode } from 'angular-tree-component';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map, take, withLatestFrom } from 'rxjs/operators';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { ToggleDelta } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import {
  selectDelta,
  selectDerived,
  selectIgId,
} from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { IgService } from '../../../ig/services/ig.service';
import { LibraryService } from '../../../library/services/library.service';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IExportConfigurationGlobal } from '../../models/config.interface';
import { ConfigurationTocComponent } from '../configuration-toc/configuration-toc.component';

@Component({
  selector: 'app-export-configuration-dialog',
  templateUrl: './export-configuration-dialog.component.html',
  styleUrls: ['./export-configuration-dialog.component.scss'],
})
export class ExportConfigurationDialogComponent implements OnInit {
  selected: IDisplayElement;
  type: Type;
  docType: Type;
  @ViewChild(ConfigurationTocComponent) toc;
  initialConfig: IExportConfigurationGlobal;
  filter: any;
  loading = false;
  defaultConfig: any;
  nodes: Observable<TreeNode>;
  deltaMode$: Observable<boolean>;
  current: any = {};
  derived: boolean;
  delta: any;
  selectedDeltaValues = [];
  configurationName: string;
  documentId: string;

  constructor(
    public dialogRef: MatDialogRef<ExportConfigurationDialogComponent>,
    private libraryService: LibraryService,
    private igService: IgService,

    @Inject(MAT_DIALOG_DATA) public data: any, private store: Store<any>) {
    this.initialConfig = data.decision;
    this.nodes = data.toc;
    this.configurationName = data.configurationName;
    this.deltaMode$ = this.store.select(selectDelta);
    this.store.select(selectDerived).pipe(take(1)).subscribe((x) => this.derived = x);
    this.filter = this.initialConfig.exportFilterDecision;
    this.defaultConfig = _.cloneDeep(data.decision.exportConfiguration);
    this.type = data.type;
    this.docType = data.type;
    this.delta = data.delta;
    this.documentId = data.documentId;
  }
  select(node) {
    this.loading = true;
    this.selected = node;
    this.type = node.type;
    switch (this.type) {
      case Type.SEGMENT: {
        console.log('Type in TOC is S:' + this.type);
        if (this.filter.overiddedSegmentMap[node.id]) {
          this.current = this.filter.overiddedSegmentMap[node.id];
        } else {
          this.current = _.cloneDeep(this.defaultConfig.segmentExportConfiguration);
        }

        this.loading = false;
        break;
      }
      case Type.DATATYPE: {
        console.log('Type in TOC is D:' + this.type);
        if (this.filter.overiddedDatatypesMap[node.id]) {
          this.current = this.filter.overiddedDatatypesMap[node.id];

        } else {
          this.current = _.cloneDeep(this.defaultConfig.datatypeExportConfiguration);
        }
        this.loading = false;
        break;
      }
      case Type.CONFORMANCEPROFILE: {
        console.log('toc', node, this.filter);
        if (this.filter.overiddedConformanceProfileMap[node.id]) {
          this.current = this.filter.overiddedConformanceProfileMap[node.id];
        } else {
          this.current = _.cloneDeep(this.defaultConfig.conformamceProfileExportConfiguration);
        }
        this.loading = false;
        break;
      }
      case Type.VALUESET: {
        if (this.filter.overiddedValueSetMap[node.id]) {
          this.current = this.filter.overiddedValueSetMap[node.id];
        } else {
          this.current = _.cloneDeep(this.defaultConfig.valueSetExportConfiguration);
        }
        this.loading = false;
        break;
      }
      default: {
        break;
      }
    }
  }

  applyChange(event: any) {
    switch (this.type) {
      case Type.SEGMENT: {
        this.filter.overiddedSegmentMap[this.selected.id] = event;
        break;
      }
      case Type.DATATYPE: {
        this.filter.overiddedDatatypesMap[this.selected.id] = event;
        break;
      }
      case Type.CONFORMANCEPROFILE: {
        this.filter.overiddedConformanceProfileMap[this.selected.id] = event;
        break;
      }
      case Type.VALUESET: {
        this.filter.overiddedValueSetMap[this.selected.id] = event;
        break;
      }
    }
  }

  ngOnInit() {
    console.log('DOCTYPE IS :' + this.docType);
  }

  applyLastUserConfiguration() {
    if (this.docType === Type.IGDOCUMENT) {
      console.log(this.documentId);
      this.igService.getLastUserConfiguration(this.documentId).subscribe(
        (lastConfig) => {
          this.filter = {... lastConfig.exportFilterDecision, changed: this.initialConfig.exportFilterDecision.changed};
          this.initialConfig = lastConfig;

        },
        // lastConfig =>     console.log(" lastConfig is : ",lastConfig),

      );
    } else {
      if (this.docType === Type.DATATYPELIBRARY) {
        this.libraryService.getLastUserConfiguration(this.documentId).subscribe(
          (lastConfig) => {
            this.initialConfig = lastConfig;
            this.filter = this.initialConfig.exportFilterDecision;

          },
              );
    }
  }
  }
  submit() {
    console.log('new initalConfig is : ', this.initialConfig);
    this.dialogRef.close(this.filter);
  }
  cancel() {
    this.dialogRef.close();
  }
  filterFn(value: any) {
    this.toc.filter(value);
  }

  scrollTo(messages: string) {
    this.toc.scrollTo(messages);
  }
  toggleDelta() {
    this.toc.filter('');
    this.store.select(selectIgId).pipe(
      take(1),
      withLatestFrom(this.deltaMode$),
      map(([id, delta]) => {
        this.store.dispatch(new ToggleDelta(id, !delta));
      }),
    ).subscribe();
  }
  filterByDelta($event: string[]) {
    let subscription = this.store.select(fromIgamtDisplaySelectors.selectAllDatatypes).pipe(
      map((value: IDisplayElement[], number: any) => {
        for (const display of value) {
          this.filter.datatypesFilterMap[display.id] = $event.indexOf(display.delta) > -1;
        }
      })).subscribe();

    subscription.unsubscribe();
    subscription = this.store.select(fromIgamtDisplaySelectors.selectAllSegments).pipe(
      map((value: IDisplayElement[], number: any) => {
        for (const display of value) {
          this.filter.segmentFilterMap[display.id] = $event.indexOf(display.delta) > -1;
        }
      })).subscribe();
    subscription.unsubscribe();
    subscription = this.store.select(fromIgamtDisplaySelectors.selectAllValueSets).pipe(
      map((value: IDisplayElement[], number: any) => {
        for (const display of value) {
          this.filter.valueSetFilterMap[display.id] = $event.indexOf(display.delta) > -1;
        }
      })).subscribe();
    subscription.unsubscribe();

    subscription = this.store.select(fromIgamtDisplaySelectors.selectAllMessages).pipe(
      map((value: IDisplayElement[], number: any) => {
        for (const display of value) {
          this.filter.conformanceProfileFilterMap[display.id] = $event.indexOf(display.delta) > -1;
        }
      })).subscribe();
    subscription.unsubscribe();
  }
}
