import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectWorkspaceActive } from '../../../../root-store/documentation/documentation.reducer';
import { ICodeSetActive } from '../../models/code-set.models';

@Component({
  selector: 'app-code-set-active-titlebar',
  templateUrl: './code-set-active-titlebar.component.html',
  styleUrls: ['./code-set-active-titlebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeSetActiveTitlebarComponent implements OnInit {

  active$: Observable<ICodeSetActive>;
  @Input() controls: TemplateRef<any>;
  @Input() header: TemplateRef<any>;

  constructor(
    private store: Store<any>,
  ) {
    this.active$ = this.store.select(selectWorkspaceActive);
  }

  ngOnInit() { }
}
