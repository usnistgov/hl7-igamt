import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { CsDialogComponent } from '../../../shared/components/cs-dialog/cs-dialog.component';
import { Type } from '../../../shared/constants/type.enum';
import {
  CoConstraintGroupBindingType,
  ICoConstraintBindingSegment,
  ICoConstraintGroupBindingRef,
  ICoConstraintTable,
  ICoConstraintTableConditionalBinding,
  IStructureElementRef,
} from '../../../shared/models/co-constraint.interface';
import { IConformanceProfile } from '../../../shared/models/conformance-profile.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { ISegment } from '../../../shared/models/segment.interface';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { CoConstraintEntityService } from '../../services/co-constraint-entity.service';
import { CoConstraintGroupSelectorComponent } from '../co-constraint-group-selector/co-constraint-group-selector.component';
import { CoConstraintAction, CoConstraintTableComponent } from '../co-constraint-table/co-constraint-table.component';

@Component({
  selector: 'app-segment-co-constraint-binding',
  templateUrl: './segment-co-constraint-binding.component.html',
  styleUrls: ['./segment-co-constraint-binding.component.scss'],
})
export class SegmentCoConstraintBindingComponent implements OnInit {

  segment$: Observable<ISegment>;
  binding: ICoConstraintBindingSegment;

  @Input()
  datatypes: IDisplayElement[];
  @Input()
  valueSets: IDisplayElement[];
  @Input()
  segments: IDisplayElement[];
  @Input()
  conformanceProfile: Observable<IConformanceProfile>;
  @Input()
  context: IStructureElementRef;
  @Input()
  igId: string;
  @Output()
  valueChange: EventEmitter<ICoConstraintBindingSegment>;
  @ViewChildren(CoConstraintTableComponent)
  tableComponents: QueryList<CoConstraintTableComponent>;
  @Output()
  delete: EventEmitter<boolean>;

  @Input()
  set value(binding: ICoConstraintBindingSegment) {
    this.binding = {
      ...binding,
    };
    this.segment$ = this.getSegment(binding.flavorId);
  }

  constructor(
    protected actions$: Actions,
    private dialog: MatDialog,
    protected store: Store<any>,
    public repository: StoreResourceRepositoryService,
    protected ccService: CoConstraintEntityService) {
    this.valueChange = new EventEmitter<ICoConstraintBindingSegment>();
    this.delete = new EventEmitter<boolean>();
  }

  triggerRemove() {
    this.delete.emit(true);
  }

  getSegment(id: string): Observable<ISegment> {
    return this.repository.fetchResource(Type.SEGMENT, id).pipe(take(1), map((seg) => seg as ISegment));
  }

  createTable(binding: ICoConstraintBindingSegment, segment: ISegment) {
    this.ccService.createCoConstraintTableForSegment(segment, this.repository).pipe(
      take(1),
      tap((table) => {
        binding.tables.push({
          condition: undefined,
          value: table,
        });
        this.triggerChange();
      }),
    ).subscribe();
  }

  importCoConstraintGroup(binding: ICoConstraintBindingSegment, id: number) {
    const component = this.tableComponents.find((table) => table.id === id);
    const display = this.segments.find((elm) => elm.id === binding.flavorId);
    if (display && component) {
      const dialogRef = this.dialog.open(CoConstraintGroupSelectorComponent, {
        data: {
          segment: display,
          igId: this.igId,
        },
      });

      dialogRef.afterClosed().subscribe(
        (result: IDisplayElement[]) => {
          if (result) {
            result.forEach((groupDisplay) => {
              const exist = component.value.groups.find((elm) => {
                return elm.type === CoConstraintGroupBindingType.REF && (elm as ICoConstraintGroupBindingRef).refId === groupDisplay.id;
              });

              if (!exist) {
                component.dispatch({
                  type: CoConstraintAction.IMPORT_GROUP,
                  payload: this.ccService.createCoConstraintGroupBinding(groupDisplay.id),
                });
              }
            });
          }
        },
      );
    }
  }

  openConditionDialog(context: any, conditional: ICoConstraintTableConditionalBinding) {
    const dialogRef = this.dialog.open(CsDialogComponent, {
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        title: 'Co-Constraint Table Conditional',
        assertionMode: true,
        context: context.path,
        assertion: conditional.condition,
        resource: this.conformanceProfile,
        excludePaths: [this.binding.segment.pathId],
      },
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          conditional.condition = result.assertion;
          this.triggerChange();
        }
      },
    );
  }

  addCoConstraintGroup(id: number) {
    const group = this.ccService.createEmptyContainedGroupBinding();
    const component = this.tableComponents.find((table) => table.id === id);
    if (component) {
      component.dispatch({
        type: CoConstraintAction.ADD_GROUP,
        payload: group,
      });
    }
  }

  deleteTable(segment: ICoConstraintBindingSegment, i: number) {
    segment.tables.splice(i, 1);
    this.triggerChange();
  }

  clearCondition(conditional: ICoConstraintTableConditionalBinding) {
    conditional.condition = undefined;
    this.triggerChange();
  }

  tableChange(table: ICoConstraintTable, id: number) {
    if (id >= 0 && this.binding.tables.length > id) {
      this.valueChange.emit({
        ...this.binding,
        tables: [
          ...this.binding.tables.map((elm, i) => {
            if (i !== id) {
              return elm;
            } else {
              return {
                ...elm,
                value: table,
              };
            }
          }),
        ],
      });
    }
  }

  triggerChange() {
    this.valueChange.emit(this.binding);
  }

  ngOnInit() {
  }

}
