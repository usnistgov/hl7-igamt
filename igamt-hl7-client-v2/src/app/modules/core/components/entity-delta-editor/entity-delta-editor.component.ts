import { OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { TreeNode } from 'primeng/primeng';
import { Observable, of } from 'rxjs';
import { concatMap, map, pluck } from 'rxjs/operators';
import { IDelta } from 'src/app/modules/shared/models/delta';
import { EditorSave } from '../../../../root-store/document/document-edit/ig-edit.actions';
import { HL7v2TreeColumnType } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IEditorMetadata } from '../../../shared/models/editor.enum';
import { AbstractEditorComponent } from '../abstract-editor-component/abstract-editor-component.component';

export abstract class EntityDeltaEditorComponent extends AbstractEditorComponent implements OnInit {

  delta$: Observable<IDelta>;

  constructor(
    readonly editor: IEditorMetadata,
    protected actions$: Actions,
    protected store: Store<any>,
    public columns: HL7v2TreeColumnType[]) {
    super(editor, actions$, store);
    this.delta$ = this.currentSynchronized$.pipe(
      pluck('value'),
      map((delta: IDelta) => {
        if (delta) {
          return {
            ...delta,
            delta: this.prepare(delta.delta),
          };
        }
      }),
    );
  }

  prepare(tree: TreeNode[]) {
    if (tree) {
      return tree.filter((node) => {
        return node.data.action !== 'UNCHANGED';
      }).map((node) => {
        return {
          ...node,
          children: this.prepare(node.children),
          expanded: true,
        };
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
