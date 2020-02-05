import { OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { TreeNode } from 'primeng/primeng';
import { Observable, of } from 'rxjs';
import { concatMap, map, pluck } from 'rxjs/operators';
import { IDelta } from 'src/app/modules/shared/models/delta';
import { EditorSave } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { HL7v2TreeColumnType } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IEditorMetadata } from '../../../shared/models/editor.enum';
import { AbstractEditorComponent } from '../abstract-editor-component/abstract-editor-component.component';
import { IValuesetDelta, ICodeDelta } from 'src/app/modules/shared/models/valueset-delta';

export abstract class ValuesetDeltaEditorComponent extends AbstractEditorComponent implements OnInit {

  delta$: Observable<IValuesetDelta>;
  columns: any[] = [];

  constructor(
    readonly editor: IEditorMetadata,
    protected actions$: Actions,
    protected store: Store<any>) {
    super(editor, actions$, store);
    this.columns = [];
    this.columns.push({ field: 'value', header: 'Value' });
    this.columns.push({ field: 'description', header: 'Description' });
    this.columns.push({ field: 'codeSystem', header: 'Code System' });
    this.columns.push({ field: 'usage', header: 'Usage' });
    this.columns.push({ field: 'comments', header: 'Comments' });
    this.delta$ = this.currentSynchronized$.pipe(
      pluck('value'),
      map((delta: IValuesetDelta) => {
        if (delta) {
          console.log(delta)
          return {
            ...delta,
            delta: {
              ...delta.delta,
              codes: this.prepare(delta.delta.codes)
            },
          };
        }
      }),
    );
  }

  prepare(codes: ICodeDelta[]) {
    if (codes) {
      return codes.filter((code) => {
        return code.action !== 'UNCHANGED';
      });
    } else {
      return [];
    }
  }

  get type(): Type {
    return this.editor.resourceType;
  }

  url() {
    return this.type.toLowerCase();
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return of();
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      concatMap((id) => {
        return this.store.select(this.elementSelector(), { id });
      }),
    );
  }

  abstract elementSelector(): MemoizedSelectorWithProps<object, { id: string }, IDisplayElement>;

  onDeactivate(): void {
  }

  ngOnInit() {
  }

}
