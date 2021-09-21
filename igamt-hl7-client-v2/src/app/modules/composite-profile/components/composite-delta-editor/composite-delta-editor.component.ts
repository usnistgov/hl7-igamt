import { Component, OnInit } from '@angular/core';
import {Actions} from '@ngrx/effects';
import {Action, MemoizedSelectorWithProps, Store} from '@ngrx/store';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {concatMap, map, pluck, tap} from 'rxjs/operators';
import {selectCompositeProfileById} from '../../../../root-store/dam-igamt/igamt.resource-display.selectors';
import * as fromIgamtDisplaySelectors from '../../../../root-store/dam-igamt/igamt.resource-display.selectors';
import {selectSelectedResource} from '../../../../root-store/dam-igamt/igamt.selected-resource.selectors';
import {selectValueSetsNodes} from '../../../../root-store/library/library-edit/library-edit.selectors';
import {AbstractEditorComponent} from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import {EntityDeltaNavigationPills} from '../../../core/components/entity-delta-editor/entity-delta-editor.component';
import * as fromDam from '../../../dam-framework/store';
import {HL7v2TreeColumnType} from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import {Type} from '../../../shared/constants/type.enum';
import {IDelta, IDeltaTreeNode} from '../../../shared/models/delta';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {EditorID, IHL7EditorMetadata} from '../../../shared/models/editor.enum';
import {IResource} from '../../../shared/models/resource.interface';

@Component({
  selector: 'app-composite-delta-editor',
  templateUrl: './composite-delta-editor.component.html',
  styleUrls: ['./composite-delta-editor.component.css'],
})
export class CompositeDeltaEditorComponent  extends AbstractEditorComponent implements OnInit {

  delta$: Observable<IDelta<any>>;

  constructor(
    protected actions$: Actions,
    protected store: Store<any>) {
    super({
      id: EditorID.COMPOSITE_PROFILE_DELTA,
      resourceType: Type.COMPOSITEPROFILE,
      title: 'Delta',
    }, actions$, store);
    console.log('CALLED');
    this.delta$ = this.currentSynchronized$.pipe(
      pluck('value'),
      map((delta: IDelta<any>) => {
          return delta;
      }),
    );
  }
  get type(): Type {
    return this.editor.resourceType;
  }

  url() {
    return this.type.toLowerCase();
  }

  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return of();
}

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      concatMap((id) => {
        return this.store.select(selectCompositeProfileById, { id });
      }),
    );
}

  onDeactivate(): void {
  }

  ngOnInit() {
  }

}
