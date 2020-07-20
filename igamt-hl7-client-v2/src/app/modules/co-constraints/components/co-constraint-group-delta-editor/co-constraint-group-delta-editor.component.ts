import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { concatMap, pluck, map } from 'rxjs/operators';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { selectCoConstraintGroupsById } from '../../../../root-store/dam-igamt/igamt.resource-display.selectors';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { Type } from '../../../shared/constants/type.enum';
import { IDelta } from '../../../shared/models/delta';
import { EditorID } from '../../../shared/models/editor.enum';
import { ISegment } from '../../../shared/models/segment.interface';
import { ICoConstraint, ICoConstraintGroup } from '../../../shared/models/co-constraint.interface';
import { selectValueSetsNodes } from '../../../../root-store/library/library-edit/library-edit.selectors';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';

@Component({
  selector: 'app-co-constraint-group-delta-editor',
  templateUrl: './co-constraint-group-delta-editor.component.html',
  styleUrls: ['./co-constraint-group-delta-editor.component.scss'],
})
export class CoConstraintGroupDeltaEditorComponent extends AbstractEditorComponent implements OnInit {

  public segment$: Observable<ISegment>;
  public datatypes: Observable<IDisplayElement[]>;
  public valueSets: Observable<IDisplayElement[]>;
  public s_workspace: Subscription;
  delta$: Observable<IDelta<ICoConstraintGroup>>;

  constructor(
    protected actions$: Actions,
    protected store: Store<any>) {
    super({
      id: EditorID.CC_GROUP_DELTA,
      title: 'Delta',
      resourceType: Type.COCONSTRAINTGROUP,
    }, actions$, store);

    this.datatypes = this.store.select(fromIgamtDisplaySelectors.selectAllDatatypes);
    this.valueSets = this.store.select(selectValueSetsNodes);

    this.delta$ = this.currentSynchronized$.pipe(
      pluck('value'),
      map((delta: IDelta<ICoConstraintGroup>) => {
        if (delta) {
          const abc = {
            ...delta,
            delta: this.prepare(delta.delta),
          };
          console.log(abc);
          return abc;
        }
      }),
    );

    this.segment$ = this.initial$.pipe(
      pluck('segment'),
    );
  }

  prepare(group: ICoConstraintGroup): ICoConstraintGroup {
    if (group) {
      return {
        ...group,
        coConstraints: this.filterCcList(group.coConstraints),
      };
    }
    return group;
  }

  filterCcList(ccs: ICoConstraint[]): ICoConstraint[] {
    return ccs.filter((cc) => cc.delta !== 'UNCHANGED');
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
        return this.store.select(selectCoConstraintGroupsById, { id });
      }),
    );
  }
  onDeactivate(): void {
  }

  ngOnInit() {
  }

}
