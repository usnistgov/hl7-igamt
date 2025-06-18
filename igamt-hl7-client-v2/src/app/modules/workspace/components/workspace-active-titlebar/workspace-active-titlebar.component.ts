import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IWorkspaceActive } from 'src/app/modules/dam-framework';
import { IDocumentDisplayInfo, IgDocument } from 'src/app/modules/ig/models/ig/ig-document.class';
import { IgService } from 'src/app/modules/ig/services/ig.service';
import { selectWorkspaceActive } from '../../../../root-store/documentation/documentation.reducer';

@Component({
  selector: 'app-workspace-active-titlebar',
  templateUrl: './workspace-active-titlebar.component.html',
  styleUrls: ['./workspace-active-titlebar.component.scss'],
})
export class WorkspaceActiveTitlebarComponent implements OnInit {

  active$: Observable<IWorkspaceActive>;
  @Input() controls: TemplateRef<any>;
  @Input() header: TemplateRef<any>;

  constructor(
    private store: Store<any>,
  ) {
    this.active$ = this.store.select(selectWorkspaceActive);
  }

  ngOnInit() { }
}
