import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import * as fromIgDocumentEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { IWorkspaceActive } from '../../../dam-framework/models/data/workspace';
import {
  IDocumentDisplayInfo,
  IgDocument,
} from '../../models/ig/ig-document.class';
import { IgService } from '../../services/ig.service';

@Component({
  selector: 'app-ig-edit-active-titlebar',
  templateUrl: './ig-edit-active-titlebar.component.html',
  styleUrls: ['./ig-edit-active-titlebar.component.scss'],
})
export class IgEditActiveTitlebarComponent implements OnInit {
  @Input() active: IWorkspaceActive;
  @Input() controls: TemplateRef<any>;
  @Input() header: TemplateRef<any>;

  constructor(
    private store: Store<IDocumentDisplayInfo<IgDocument>>,
    private igService: IgService,
  ) {}

  ngOnInit() {}
  getIgId(): Observable<string> {
    return this.store.select(fromIgDocumentEdit.selectIgId);
  }
  exportDiffXML() {
    this.getIgId()
      .pipe(
        take(1),
        map((id) => this.igService.exportProfileDiffXML(id, this.active.display.id)),
      )
      .subscribe();
  }
}
