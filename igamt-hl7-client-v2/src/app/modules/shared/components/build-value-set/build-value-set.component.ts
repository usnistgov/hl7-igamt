import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { IAddingInfo, SourceType } from '../../models/adding-info';
import { Type } from '../../constants/type.enum';
import {
  BrowseType,
  CodeSetBrowseDialogComponent,
  IBrowserTreeNode,
} from '../codeset-browse-dialog/codeset-browse-dialog.component';
import { map } from 'rxjs/operators';
import { IDisplayElement } from '../../models/display-element.interface';
import { Scope } from '@angular/core/src/profile/wtf_impl';

@Component({
  selector: 'app-build-value-set',
  templateUrl: './build-value-set.component.html',
  styleUrls: ['./build-value-set.component.css'],
})
export class BuildValueSetComponent implements OnInit {
  model: IAddingInfo;
  @ViewChild(NgForm) child;
  redirect = true;
  notDefinedOption = { label: 'Not defined', value: 'Undefined' };
  asIgamtExternalValueSet = false;
  selectedCodeSet: IBrowserTreeNode;

  stabilityOptionsOptions = [
    this.notDefinedOption,
    { label: 'Dynamic', value: 'Dynamic' },
    { label: 'Static', value: 'Static' },
  ];
  extensibilityOptions = [
    this.notDefinedOption,
    { label: 'Open', value: 'Open' },
    { label: 'Closed', value: 'Closed' },
  ];
  contentDefinitionOptions = [
    this.notDefinedOption,
    { label: 'Extensional', value: 'Extensional' },
    { label: 'Intensional', value: 'Intensional' },
  ];

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<BuildValueSetComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { asIgamtExternalValueSet?: boolean; existing?: IDisplayElement[]; scope?: Scope; type?: Type }
  ) {
    this.asIgamtExternalValueSet = data.asIgamtExternalValueSet;
    this.model = {
      originalId: null,
      id: null,
      sourceType: this.asIgamtExternalValueSet ? SourceType.EXTERNAL : SourceType.INTERNAL,
      name: '',
      type: Type.VALUESET,
      ext: '',
      flavor: true,
      url: '',
    };
  }

  selectExistingCodeSet() {
    this.dialog
      .open(CodeSetBrowseDialogComponent, {
        data: {
          browserType: BrowseType.ENTITY,
          scope: {
            private: true,
            public: true,
          },
          types: [Type.CODESET, Type.CODESETVERSION],
          exclude: [],
          selectionMode: 'single',
          includeVersions: true,
        },
      })
      .afterClosed()
      .pipe(
        map((browserResult: IBrowserTreeNode) => {
          this.selectedCodeSet = browserResult;
          this.setURL(browserResult);
        })
      )
      .subscribe();
  }

  clearSelection() {
    this.selectedCodeSet = null;
    this.model.url = '';
  }

  setURL(selectedNode: IBrowserTreeNode) {
    let codeSetId: string;
    let codeSetVersion: string;

    if (selectedNode.data.type === Type.CODESET) {
      codeSetId = selectedNode.data.id;
    } else if (selectedNode.data.type === Type.CODESETVERSION) {
      codeSetVersion = selectedNode.data.label;
      codeSetId = selectedNode.parent ? selectedNode.parent.data.id : undefined;
    }
    const host = window.location.protocol + '//' + window.location.host;
    let url = host + '/codesets/' + codeSetId;
    if (codeSetVersion) {
      url = url + '?version=' + codeSetVersion;
    }
    this.model.url = url;
  }

  ngOnInit() {}

  submit() {
    this.dialogRef.close(this.model);
  }

  cancel() {
    this.dialogRef.close();
  }

  isValid() {
    return this.child && this.child.isValid();
  }
}
