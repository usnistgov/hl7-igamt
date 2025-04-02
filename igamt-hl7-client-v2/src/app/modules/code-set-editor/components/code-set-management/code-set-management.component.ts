import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ConfirmationService } from 'primeng/primeng';
import { tap } from 'rxjs/operators';
import { ICodeSetInfo, ICodeSetVersionInfo } from 'src/app/modules/code-set-editor/models/code-set.models';
import { ConfirmDialogComponent } from 'src/app/modules/dam-framework/components/fragments/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-code-set-management',
  templateUrl: './code-set-management.component.html',
  styleUrls: ['./code-set-management.component.css'],
})
export class CodeSetManagementComponent implements OnInit {

  filterExposed = false;
  committedChildren: ICodeSetVersionInfo[];
  filteredChildren: ICodeSetVersionInfo[];
  selectedFilters: any[] = [];
  filterOptions: any[];
  defaultVersionId: string;
  _info: ICodeSetInfo;

  selectedVersion: ICodeSetVersionInfo;

  @ViewChild('form') form!: NgForm;

  @Output()
  changes: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  set info(param: ICodeSetInfo) {
    this._info = param;
    this.selectedVersion = this._info.children.find((x) => x.id === param.defaultVersion);
    this.committedChildren = this._info.children.filter((x) => x.dateCommitted);
  }

  get info() {
    return this._info;
  }

  constructor(private confirmationService: ConfirmationService, private dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    this.filteredChildren = [...this.info.children];
    this.initializeFilters();

  }
  confirm() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
      },
    });
  }

  confirmAction(action: string, id: string) {
    const message = 'Are you sure you want to ' + action + ' this code Set ';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        question: message,
        action: action + ' CONFIRMATION',
      },
    });
    dialogRef.afterClosed().subscribe(
      (answer) => {
        if (answer) {
          if (action === 'DELETE') {
            this.deleteById(id);
            this.changes.emit({ info: this.info, valid: this.form.valid });
          }
          if (action === 'ARCHIVE') {
            this.deprecateById(this.info.children, id);
            this.deprecateById(this.filteredChildren, id);
            this.changes.emit({ info: this.info, valid: this.form.valid });
          }
        }
      },
    );
  }

  deprecateById(objects: ICodeSetVersionInfo[], idToDeprecate: string): void {
    const res = objects.find((obj) => obj.id === idToDeprecate);
    if (res) {
      res.deprecated = true;
    }
  }

  deleteById(idToDelete: string) {
    this.filteredChildren = this.filteredChildren.filter((obj) => obj.id !== idToDelete);
    this.info.children = this.info.children.filter((obj) => obj.id !== idToDelete);
  }

  initializeFilters() {
    this.filterOptions = [
      { label: 'Committed', value: 'committed' },
      { label: 'Archived', value: 'archived' },
    ];
  }

  applyFilters($event) {
    this.selectedFilters = $event.value;
    this.filteredChildren = this.info.children.filter((item) => {

      return this.selectedFilters.every((filter) => {
        if (filter === 'committed') {
          return item.dateCommitted !== null;
        } else if (filter === 'exposed') {
          return item.exposed === true;
        } else if (filter === 'archived') {
          return item.deprecated === true;
        }
        return true;
      });
    });
  }

  updateDefault(version: ICodeSetVersionInfo) {

    this.info.defaultVersion = version.id;
    this.changes.emit({ info: this.info, valid: this.form.valid });

  }

  disableKeyProtection() {
    if (this.info.disableKeyProtection) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          action: 'Disable Key Protection',
          question: 'By enabling API access without an API key, anybody with this code sets\' link will be able to read its content. If you want to protect API access with an API key, create an API key by clicking on your username in the top right corner and selecting the "API Key" menu option.\n Are you sure you want to enable API access without an API key?',
        },
      }).afterClosed().pipe(
        tap((response) => {
          if (response) {
            this.info.disableKeyProtection = true;
          } else {
            this.info.disableKeyProtection = false;
          }
          this.emitChange();
        }),
      ).subscribe();
    } else {
      this.emitChange();
    }
  }

  emitChange() {

    this.changes.emit({ info: this.info, valid: this.form.valid });
  }

}
