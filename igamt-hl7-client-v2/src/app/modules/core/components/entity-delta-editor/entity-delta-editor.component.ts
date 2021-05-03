import { OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { TreeNode } from 'primeng/primeng';
import { Observable, of, ReplaySubject } from 'rxjs';
import { concatMap, map, pluck } from 'rxjs/operators';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { IDelta } from 'src/app/modules/shared/models/delta';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { selectSelectedResource } from '../../../../root-store/dam-igamt/igamt.selected-resource.selectors';
import { selectValueSetsNodes } from '../../../../root-store/library/library-edit/library-edit.selectors';
import { HL7v2TreeColumnType } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../shared/constants/type.enum';
import { CoConstraintGroupBindingType, ICoConstraint, ICoConstraintBindingContext, ICoConstraintGroupBinding, ICoConstraintGroupBindingContained, ICoConstraintTable } from '../../../shared/models/co-constraint.interface';
import { IDeltaTreeNode } from '../../../shared/models/delta';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IHL7EditorMetadata } from '../../../shared/models/editor.enum';
import { IResource } from '../../../shared/models/resource.interface';
import { AbstractEditorComponent } from '../abstract-editor-component/abstract-editor-component.component';

export enum EntityDeltaNavigationPills {
  STRUCTURE = 'Structure',
  CONFORMANCE_STATEMENTS = 'Conformance Statements',
  COCONSTRAINTS = 'Co-Constraints',
}

export abstract class EntityDeltaEditorComponent extends AbstractEditorComponent implements OnInit {

  delta$: Observable<IDelta<IDeltaTreeNode[]>>;
  activeTab: EntityDeltaNavigationPills;
  TABS = EntityDeltaNavigationPills;
  public resource: Observable<IResource>;
  public segments: Observable<IDisplayElement[]>;
  public datatypes: Observable<IDisplayElement[]>;
  public valueSets: Observable<IDisplayElement[]>;

  constructor(
    readonly editor: IHL7EditorMetadata,
    protected actions$: Actions,
    protected store: Store<any>,
    public deltaTabs: EntityDeltaNavigationPills[],
    public columns: HL7v2TreeColumnType[]) {
    super(editor, actions$, store);
    this.activeTab = deltaTabs && deltaTabs.length > 0 ? deltaTabs[0] : undefined;
    this.datatypes = this.store.select(fromIgamtDisplaySelectors.selectAllDatatypes);
    this.segments = this.store.select(fromIgamtDisplaySelectors.selectAllSegments);
    this.valueSets = this.store.select(selectValueSetsNodes);
    this.resource = this.store.select(selectSelectedResource);

    this.delta$ = this.currentSynchronized$.pipe(
      pluck('value'),
      map((delta: IDelta<IDeltaTreeNode[]>) => {
        if (delta) {
          return {
            ...delta,
            coConstraintBindings: this.filterBindings(delta.coConstraintBindings),
          };
        }
      }),
    );
  }

  filterBindings(coConstraintBindings: ICoConstraintBindingContext[]) {
    if (coConstraintBindings) {
      return coConstraintBindings.filter((cb) => cb.delta !== 'UNCHANGED').map((cb) => {
        return {
          ...cb,
          bindings: cb.bindings.filter((csb) => cb.delta !== 'UNCHANGED').map((csb) => {
            return {
              ...csb,
              tables: csb.tables.filter((t) => t.delta !== 'UNCHANGED').map((t) => {
                return {
                  ...t,
                  value: this.filterCcTable(t.value),
                };
              }),
            };
          }),
        };
      });
    }
  }

  filterCcTable(table: ICoConstraintTable): ICoConstraintTable {
    return {
      ...table,
      coConstraints: this.filterCcList(table.coConstraints),
      groups: this.filterGroup(table.groups),
    };
  }

  filterCcList(ccs: ICoConstraint[]): ICoConstraint[] {
    return ccs.filter((cc) => cc.delta !== 'UNCHANGED');
  }

  filterGroup(cgbs: ICoConstraintGroupBinding[]): ICoConstraintGroupBinding[] {
    return cgbs.filter((cgb) => cgb.delta !== 'UNCHANGED').map((cgb) => {
      if (cgb.type === CoConstraintGroupBindingType.CONTAINED) {
        const cgbc = cgb as ICoConstraintGroupBindingContained;
        return {
          ...cgbc,
          coConstraints: this.filterCcList(cgbc.coConstraints),
        };
      } else {
        return cgb;
      }
    });
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
