import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TreeNode } from 'angular-tree-component';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { ConfigurationTocComponent } from '../configuration-toc/configuration-toc.component';
import { IExportConfigurationGlobal } from '../../models/config.interface';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-export-configuration-dialog',
  templateUrl: './export-configuration-dialog.component.html',
  styleUrls: ['./export-configuration-dialog.component.scss'],
})
export class ExportConfigurationDialogComponent implements OnInit {
  selected: IDisplayElement;
  type: Type;
  @ViewChild(ConfigurationTocComponent) toc;
  initialConfig: IExportConfigurationGlobal;
  filter: any;
  loading = false;
  defaultConfig: any;
  nodes: Observable<TreeNode>;
  current: any = {};
  constructor(
    public dialogRef: MatDialogRef<ExportConfigurationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.initialConfig = data.decision;
    this.nodes = data.toc;
    this.filter = this.initialConfig.exportFilterDecision;
    this.defaultConfig = _.cloneDeep(data.decision.exportConfiguration);
  }
  select(node) {
    this.loading = true;
    this.selected = node;
    this.type = node.type;
    switch (this.type) {
      case Type.SEGMENT: {
        if (this.filter.overiddedSegmentMap[node.id]) {
          this.current = this.filter.overiddedSegmentMap[node.id];
        } else {
          this.current = _.cloneDeep(this.defaultConfig.segmentExportConfiguration);
        }
        this.loading = false;
        break;
      }
      case Type.DATATYPE: {
        if (this.filter.overiddedDatatypesMap[node.id]) {
          this.current = this.filter.overiddedDatatypesMap[node.id];
        } else {
          this.current = _.cloneDeep(this.defaultConfig.datatypeExportConfiguration);
        }

        break;
      }
      case Type.CONFORMANCEPROFILE: {
        if (this.filter.overiddedConformanceProfileMap[node.id]) {
          this.current = this.filter.overiddedConformanceProfileMap[node.id];
        } else {
          this.current = _.cloneDeep(this.defaultConfig.conformamceProfileExportConfiguration);
        }

        break;
      }
      case Type.VALUESET: {
        if (this.filter.overiddedValueSetMap[node.id]) {
          this.current = this.filter.overiddedValueSetMap[node.id];
        } else {
          this.current = _.cloneDeep(this.defaultConfig.valueSetExportConfiguration);
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  applyChange(event: any) {
    this.filter.overiddedSegmentMap[this.selected.id] = event;
  }
  ngOnInit() {
  }
  submit() {
    console.log(this.data.decision);
    this.dialogRef.close(this.data.decision);
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
}
