import { TemplateRef, ViewChild } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import * as fromIgamtSelectors from 'src/app/root-store/dam-igamt/igamt.selectors';
import { DamAbstractEditorComponent } from '../../../dam-framework/services/dam-editor.component';
import { Scope } from '../../../shared/constants/scope.enum';
import { IAbstractDomain, IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IHL7WorkspaceActive } from '../../../shared/models/editor.class';
import { IHL7EditorMetadata } from '../../../shared/models/editor.enum';

export abstract class AbstractEditorComponent extends DamAbstractEditorComponent {

  readonly active$: Observable<IHL7WorkspaceActive>;
  protected _viewOnly$: Observable<boolean>;
  readonly document$: Observable<IAbstractDomain>;
  public documentRef$: Observable<IDocumentRef>;
  public documentId$: Observable<string>;
  readonly editor: IHL7EditorMetadata;

  get viewOnly$() {
    return this._viewOnly$;
  }
  @ViewChild('headerControls')
  readonly controls: TemplateRef<any>;
  @ViewChild('headerTitle')
  readonly header: TemplateRef<any>;

  constructor(
    editor: IHL7EditorMetadata,
    actions$: Actions,
    store: Store<any>) {
    super(editor, actions$, store);
    this.changeTime = new Date();
    this.active$ = this.store.select(fromIgamtSelectors.selectWorkspaceActive);
    this._viewOnly$ = combineLatest(
      this.store.select(fromIgamtSelectors.selectViewOnly),
      this.store.select(fromIgamtSelectors.selectDelta),
      this.active$.pipe(
        map((active) => {
          return active.display.domainInfo && !(active.display.domainInfo.scope === Scope.USER || (active.display.domainInfo.scope === Scope.PHINVADS && active.display.flavor));
        }),
      )).pipe(
        map(([vOnly, delta, notUser]) => {
          return vOnly || notUser || delta;
        }),
      );
    this.document$ = this.store.select(fromIgamtSelectors.selectDocument);
    this.documentRef$ = this.store.select(fromIgamtSelectors.selectLoadedDocumentInfo);
    this.documentId$ = this.documentRef$.pipe(
      pluck('documentId'),
    );
  }

  abstract editorDisplayNode(): Observable<IDisplayElement>;
}
