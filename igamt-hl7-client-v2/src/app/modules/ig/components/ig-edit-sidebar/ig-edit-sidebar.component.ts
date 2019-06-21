import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import {CopyResource, IgEditTocAddResource, UpdateSections} from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import * as fromIgDocumentEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import * as config from '../../../../root-store/config/config.reducer';
import { ClearResource, LoadResource } from '../../../../root-store/resource-loader/resource-loader.actions';
import * as fromResource from '../../../../root-store/resource-loader/resource-loader.reducer';
import {CopyResourceComponent} from '../../../shared/components/copy-resource/copy-resource.component';
import {ResourcePickerComponent} from '../../../shared/components/resource-picker/resource-picker.component';
import {Scope} from '../../../shared/constants/scope.enum';
import {Type} from '../../../shared/constants/type.enum';
import {ICopyResourceData} from '../../../shared/models/copy-resource-data';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {IResourcePickerData} from '../../../shared/models/resource-picker-data.interface';
import {IAddWrapper} from '../../models/ig/add-wrapper.class';
import {IGDisplayInfo} from '../../models/ig/ig-document.class';
import {IgTocComponent} from '../ig-toc/ig-toc.component';

@Component({
  selector: 'app-ig-edit-sidebar',
  templateUrl: './ig-edit-sidebar.component.html',
  styleUrls: ['./ig-edit-sidebar.component.scss'],
})
export class IgEditSidebarComponent implements OnInit {

  nodes$: Observable<any[]>;
  hl7Version$: Observable<string[]>;
  igId$: Observable<string>;
  version$: Observable<string>;
  @ViewChild(IgTocComponent) toc: IgTocComponent;

  constructor(private store: Store<IGDisplayInfo>, private dialog: MatDialog) {
    this.nodes$ = store.select(fromIgDocumentEdit.selectToc);
    this.hl7Version$ = store.select(config.getHl7Versions);
    this.igId$ = store.select(fromIgDocumentEdit.selectIgId);
    this.version$ = store.select(fromIgDocumentEdit.selectVersion);
  }

  ngOnInit() {
  }

  scrollTo(type) {
    this.toc.scroll(type);
  }

  filterFn(value: any) {
    this.toc.filter(value);
  }

  update($event: IDisplayElement[]) {
    this.store.dispatch(new UpdateSections($event));
  }

  addSection() {
    this.toc.addSectionToIG();
  }

  collapseAll() {
    this.toc.collapseAll();
  }

  expandAll() {
    this.toc.expandAll();
  }

  addChildren(event: IAddWrapper) {
    const subscription = this.hl7Version$.pipe(
      withLatestFrom(this.version$),
      map(([versions, selectedVersion]) => {
        this.store.dispatch(new LoadResource({ type: event.type, scope: event.scope, version: selectedVersion }));

        const dialogData: IResourcePickerData = {
          hl7Versions: versions,
          existing: event.node.children,
          title: this.getDialogTitle(event),
          data: this.store.select(fromResource.getData),
          version: selectedVersion,
          versionChange: (version: string) => {
            this.store.dispatch(new LoadResource({ type: event.type, scope: event.scope, version }));
          },
          type: event.type,
        };
        const dialogRef = this.dialog.open(ResourcePickerComponent, {
          data: dialogData,
        });
        dialogRef.afterClosed().pipe(
          map((result) => {
            this.store.dispatch(new ClearResource());
            return result;
          }),
          filter((x) => x !== undefined),
          withLatestFrom(this.igId$),
          map(([result, igId]) => {
            this.store.dispatch(new IgEditTocAddResource({ documentId: igId, selected: result, type: event.type }));
          }),
        ).subscribe();
      }),
    ).subscribe();
    subscription.unsubscribe();
  }

  copy($event: ICopyResourceData) {
    console.log($event);
    const dialogRef = this.dialog.open(CopyResourceComponent, {
      data: {...$event, targetScope: Scope.USER, title: this.getCopyTitle($event.element.type) },
    });

    dialogRef.afterClosed().pipe(
      filter((x) => x !== undefined),
      withLatestFrom(this.igId$),
      map(([result, igId]) => {
        this.store.dispatch(new CopyResource({documentId: igId, selected: result}));
      }),
    ).subscribe();
  }

  private getDialogTitle(event: IAddWrapper) {
    return 'Add ' + this.getStringFormScope(event.scope) + ' ' + this.getStringFromType(event.type);
  }

  private getStringFormScope(scope: Scope) {
    switch (scope) {
      case Scope.HL7STANDARD:
        return 'HL7 Standard';
      case Scope.USER:
        return 'USER';
      case Scope.SDTF:
        return 'Standard Data Type Flavor';
      default:
        return '';
    }
  }

  private getStringFromType(type: Type) {
    switch (type) {
      case Type.DATATYPE:
        return 'Data type';
      case Type.SEGMENT:
        return 'Segment';
      case Type.CONFORMANCEPROFILE:
        return 'Conformance Profiles';
      case Type.VALUESET:
        return 'Value Sets';
      default:
        return '';
    }
  }
  private getCopyTitle(type: Type) {
    return 'Copy ' + this.getStringFromType(type);
  }
}
