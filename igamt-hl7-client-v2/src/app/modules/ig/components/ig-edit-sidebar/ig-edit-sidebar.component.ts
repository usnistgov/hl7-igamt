import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map, withLatestFrom} from 'rxjs/operators';
import { IgEditTocAddResource, UpdateSections} from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import * as fromIgDocumentEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import * as config from '../../../../root-store/config/config.reducer';
import {LoadResource} from '../../../../root-store/resource-loader/resource-loader.actions';
import * as fromResource from '../../../../root-store/resource-loader/resource-loader.reducer';
import {ResourcePickerComponent} from '../../../shared/components/resource-picker/resource-picker.component';
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

  @ViewChild(IgTocComponent) toc: IgTocComponent;

  constructor(private store: Store<IGDisplayInfo>, private dialog: MatDialog) {
    this.nodes$ = store.select(fromIgDocumentEdit.selectToc);
    this.hl7Version$ = store.select(config.getHl7Versions);
    this.igId$ = store.select(fromIgDocumentEdit.selectIgId);

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
      withLatestFrom(this.igId$),
      map(([versions, igId]) => {
        const dialogData: IResourcePickerData = {
          hl7Versions: versions,
          existing: event.node.children,
          title: this.getDialogTitle(event),
          data: this.store.select(fromResource.getData),
          versionChange: (version: string) => {
            this.store.dispatch(new LoadResource({ type: event.type, scope: event.scope, version}));
          },
          type: event.type,
        };
        const dialogRef = this.dialog.open(ResourcePickerComponent, {
          data: dialogData,
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.store.dispatch(new IgEditTocAddResource({documentId: igId, selected: result, type:  event.type}));
        });
      }),
    ).subscribe();
    subscription.unsubscribe();
  }

  private getDialogTitle(event: IAddWrapper) {
    return 'TO-DO';
  }
}
