import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import * as fromIgDocumentEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import {UpdateSections} from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import {IDisplayElement, IGDisplayInfo} from '../../models/ig/ig-document.class';
import {IgTocComponent} from '../ig-toc/ig-toc.component';

@Component({
  selector: 'app-ig-edit-sidebar',
  templateUrl: './ig-edit-sidebar.component.html',
  styleUrls: ['./ig-edit-sidebar.component.scss'],
})
export class IgEditSidebarComponent implements OnInit {

  nodes$: Observable<any[]>;
  @ViewChild(IgTocComponent) toc: IgTocComponent;

  constructor(private store: Store<IGDisplayInfo>) {
    this.nodes$ = store.select(fromIgDocumentEdit.selectToc);
  }
  ngOnInit() {
  }
  scrollTo( type) {
    this.toc.scroll(type);
  }
  filterFn(value: any) {
    this.toc.filter(value);
  }
  update( $event: IDisplayElement[]) {
    console.log($event);
    this.store.dispatch(new UpdateSections($event));
  }
}
