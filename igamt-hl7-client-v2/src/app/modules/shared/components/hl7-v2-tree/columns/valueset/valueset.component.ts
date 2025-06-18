import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { filter, map, take, takeWhile, tap } from 'rxjs/operators';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { IChange } from 'src/app/modules/shared/models/save-change';
import { IChangeReasonSection } from 'src/app/modules/shared/services/change-log.service';
import { Type } from '../../../../constants/type.enum';
import { IBindingType, IValuesetBinding } from '../../../../models/binding.interface';
import { IResource } from '../../../../models/resource.interface';
import { ChangeType, PropertyType } from '../../../../models/save-change';
import { BindingService } from '../../../../services/binding.service';
import { AResourceRepositoryService } from '../../../../services/resource-repository.service';
import { IBinding, IBindingContext, StructureElementBindingService } from '../../../../services/structure-element-binding.service';
import {
  BindingSelectorComponent,
  IBindingLocationInfo,
} from '../../../binding-selector/binding-selector.component';
import { IValueSetBindingDisplay } from '../../../binding-selector/binding-selector.component';
import { IChangeReasonDialogDisplay } from '../../../change-reason-dialog/change-reason-dialog.component';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';
import { ISingleCodeBinding } from './../../../../models/binding.interface';

export interface IValueSetOrSingleCodeBindings {
  valueSetBindings: Array<IBinding<IValuesetBinding[]>>;
  singleCodeBindings: Array<IBinding<ISingleCodeBinding[]>>;
}

export interface IValueSetOrSingleCode {
  type: IBindingType;
  value: IValuesetBinding[] | ISingleCodeBinding[];
}

export interface IValueSetOrSingleCodeDisplay {
  type: IBindingType;
  value: IValueSetBindingDisplay[] | ISingleCodeBinding[];
}

@Component({
  selector: 'app-valueset',
  templateUrl: './valueset.component.html',
  styleUrls: ['./valueset.component.scss'],
})
export class ValuesetComponent extends HL7v2TreeColumnComponent<IValueSetOrSingleCodeBindings> implements OnInit, OnDestroy {
  freeze$: Observable<{
    context: IBindingContext,
    binding: IValueSetOrSingleCodeDisplay,
  }>;
  initialValue: IValueSetOrSingleCode;
  editable: BehaviorSubject<IValueSetOrSingleCodeDisplay>;
  editable$: Observable<IValueSetOrSingleCodeDisplay>;
  @Input()
  valueSets: IDisplayElement[];
  @Input()
  bindingInfo: IBindingLocationInfo;
  @Input()
  repository: AResourceRepositoryService;
  @Input()
  resource: IResource;

  @ViewChild('displayVsBindingList', { read: TemplateRef })
  displayVsBindingListTemplate: TemplateRef<any>;
  @ViewChild('displayScBinding', { read: TemplateRef })
  displaySingleCodeTemplate: TemplateRef<any>;
  alive: boolean;
  activeChangeLog$: Observable<IChangeReasonSection[]>;
  vsOrScBindings: IValueSetOrSingleCodeBindings;
  isOXB2MessageLevel: boolean;

  constructor(
    dialog: MatDialog,
    private structureElementBindingService: StructureElementBindingService,
    private bindingService: BindingService,
  ) {
    super([PropertyType.VALUESET, PropertyType.SINGLECODE], dialog);
    this.editable = new BehaviorSubject<IValueSetOrSingleCodeDisplay>({ type: IBindingType.VALUESET, value: undefined });
    this.editable$ = this.editable.asObservable();
  }

  mergeBindings(value: IValueSetOrSingleCodeBindings): Array<IBinding<IValueSetOrSingleCode>> {
    const merged: Array<IBinding<IValueSetOrSingleCode>> = [];

    if (value.valueSetBindings) {
      value.valueSetBindings.forEach((vsBindings) => {
        merged.push({
          context: vsBindings.context,
          level: vsBindings.level,
          value: {
            type: IBindingType.VALUESET,
            value: vsBindings.value,
          },
        });
      });
    }

    if (value.singleCodeBindings) {
      value.singleCodeBindings.forEach((singleCode) => {
        const binding = merged.find((elm) => elm.level === singleCode.level);
        if (binding) {
          throw new Error('Both single code and valueSetBindings found on the same element');
        } else {
          merged.push({
            context: singleCode.context,
            level: singleCode.level,
            value: {
              type: IBindingType.SINGLECODE,
              value: singleCode.value,
            },
          });
        }
      });
    }

    return merged;
  }

  getValueSetById(id: string): Observable<IDisplayElement> {
    return this.repository.getResourceDisplay(Type.VALUESET, id);
  }

  selectedValueSetBinding(vsOrCode: IValueSetOrSingleCodeDisplay): IValueSetBindingDisplay[] {
    if (vsOrCode && vsOrCode.type === IBindingType.VALUESET) {
      return _.cloneDeep(vsOrCode.value) as IValueSetBindingDisplay[];
    } else {
      return undefined;
    }
  }

  selectedSingleCode(vsOrCode: IValueSetOrSingleCodeDisplay): ISingleCodeBinding[] {
    if (vsOrCode && vsOrCode.type === IBindingType.SINGLECODE) {
      return _.cloneDeep(vsOrCode.value) as ISingleCodeBinding[];
    } else {
      return undefined;
    }
  }

  editBinding() {
    const dialogRef = this.dialog.open(BindingSelectorComponent, {
      data: {
        resources: this.valueSets,
        locationInfo: this.bindingInfo,
        path: null,
        obx2: this.resource.name === 'OBX' && this.position === 2,
        existingBindingType: this.editable.getValue() ? this.editable.getValue().type : undefined,
        selectedValueSetBinding: this.selectedValueSetBinding(this.editable.getValue()),
        selectedSingleCodes: this.selectedSingleCode(this.editable.getValue()),
      },
    });

    dialogRef.afterClosed().pipe(
      filter((selection) => selection !== undefined),
      tap((selection) => {
        switch (selection.selectedBindingType) {
          case IBindingType.VALUESET:
            this.vsBindingsChange(selection.selectedValueSets || []);
            this.editable.next({
              type: IBindingType.VALUESET,
              value: selection.selectedValueSets,
            });
            break;
          case IBindingType.SINGLECODE:
            this.singleCodeChange(selection.selectedSingleCodes);
            this.editable.next({
              type: IBindingType.SINGLECODE,
              value: selection.selectedSingleCodes,
            });
            break;
        }
      }),
    ).subscribe();
  }

  vsBindingsChange(change: IValueSetBindingDisplay[], skipReason: boolean = false) {
    this.onChange(
      this.initialValue ? this.initialValue.type === IBindingType.VALUESET ? this.initialValue.value : undefined : undefined,
      change.map(
        (vs) => this.transform(vs),
      ),
      PropertyType.VALUESET,
      ChangeType.UPDATE,
      skipReason,
    );
    this.updateValueSetsBindings(change);

    if (change && change.length > 0) {
      this.updateSingleCodeBindings([]);
      this.singleCodeChange([], true);
    }
  }

  updateValueSetsBindings(change: IValueSetBindingDisplay[]) {
    const valueSets = this.vsOrScBindings.valueSetBindings;
    const indexOfCurrentContext = valueSets.findIndex((b) => {
      return this.structureElementBindingService.contextIsEqual({ resource: this.context }, b.context);
    });

    if (change && change.length > 0) {
      valueSets.splice(indexOfCurrentContext, 1, {
        context: { resource: this.context },
        value: change.map(
          (vs) => this.transform(vs),
        ),
        level: 0,
      });
    } else {
      valueSets.splice(indexOfCurrentContext, 1);
    }
  }

  updateSingleCodeBindings(change: ISingleCodeBinding[]) {
    const singleCodes = this.vsOrScBindings.singleCodeBindings;
    const indexOfCurrentContext = singleCodes.findIndex((b) => {
      return this.structureElementBindingService.contextIsEqual({ resource: this.context }, b.context);
    });

    if (change) {
      singleCodes.splice(indexOfCurrentContext, 1, {
        context: { resource: this.context },
        value: change.map(
          (sg) => ({
            code: sg.code,
            codeSystem: sg.codeSystem,
            locations: sg.locations,
          }),
        ),
        level: 0,
      });
    } else {
      singleCodes.splice(indexOfCurrentContext, 1);
    }
  }

  isActualChange(change: IChange<any>): boolean {
    return true;
  }

  singleCodeChange(change: ISingleCodeBinding[], skipReason: boolean = false) {
    this.onChange(
      this.initialValue ? this.initialValue.type === IBindingType.SINGLECODE ? this.initialValue.value : undefined : undefined,
      change ? change.map(
        (sg) => ({
          code: sg.code,
          codeSystem: sg.codeSystem,
          locations: sg.locations,
        }),
      ) : undefined,
      PropertyType.SINGLECODE,
      ChangeType.UPDATE,
      skipReason,
    );
    this.updateSingleCodeBindings(change);
    if (change && change.length > 0) {
      this.vsBindingsChange([], true);
      this.updateValueSetsBindings([]);
    }
  }

  transform(display: IValueSetBindingDisplay): IValuesetBinding {
    return {
      strength: display.bindingStrength,
      valuesetLocations: display.bindingLocation,
      valueSets: display.valueSets.map((vs) => vs.id),
    };
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  getDisplayFromBinding(binding: IBinding<IValueSetOrSingleCode>): Observable<IValueSetOrSingleCodeDisplay> {
    switch (binding.value.type) {

      case IBindingType.VALUESET:
        return this.bindingService.getValueSetBindingDisplay(binding.value.value as IValuesetBinding[], this.repository).pipe(
          take(1),
          map((bindings) => {
            return {
              type: IBindingType.VALUESET,
              value: bindings,
            };
          }),
        );

      case IBindingType.SINGLECODE:
        return of({
          type: IBindingType.SINGLECODE,
          value: (binding.value.value as ISingleCodeBinding[]).map(
            (sg) => ({
              code: sg.code,
              codeSystem: sg.codeSystem,
              locations: sg.locations,
            }),
          ),
        });
    }
  }

  getDisplayTemplateForProperty(change: IChange): Observable<IChangeReasonDialogDisplay> {
    const context = { resource: this.context };
    switch (change.propertyType) {
      case PropertyType.SINGLECODE:
        return of({
          current: {
            context: {
              context,
              value: change.propertyValue,
            },
            template: this.displaySingleCodeTemplate,
          },
          previous: {
            context: {
              context,
              value: change.oldPropertyValue,
            },
            template: this.displaySingleCodeTemplate,
          },
        });
      case PropertyType.VALUESET:
        return combineLatest(
          change.oldPropertyValue ? this.bindingService.getValueSetBindingDisplay(change.oldPropertyValue, this.repository) : of(undefined),
          change.propertyValue ? this.bindingService.getValueSetBindingDisplay(change.propertyValue, this.repository) : of(undefined),
        ).pipe(
          take(1),
          map(([previous, current]) => {
            return {
              current: {
                context: {
                  context,
                  value: current || [],
                },
                template: this.displayVsBindingListTemplate,
              },
              previous: {
                context: {
                  context,
                  value: previous || [],
                },
                template: this.displayVsBindingListTemplate,
              },
            };
          }),
        );
    }
    return null;
  }

  ngOnInit() {
    const parentIsOBX = this.node && this.node.parent && this.node.parent.data && this.node.parent.data.type === Type.SEGMENTREF && this.node.parent.data.name === 'OBX';
    this.isOXB2MessageLevel = parentIsOBX && this.position === 2 && this.context !== Type.SEGMENT;
    this.alive = true;
    this.value$.pipe(
      takeWhile(() => this.alive),
    ).subscribe(
      (vsOrSingleCode) => {
        this.vsOrScBindings = vsOrSingleCode;
        const value = this.mergeBindings(vsOrSingleCode);
        const bindings = this.structureElementBindingService.getActiveAndFrozenBindings(value, { resource: this.context });

        if (bindings.active) {
          this.getDisplayFromBinding(bindings.active).pipe(
            take(1),
            tap((v) => this.editable.next(v)),
          ).subscribe();
        } else {
          this.editable.next({ type: IBindingType.VALUESET, value: undefined });
        }

        if (bindings.frozen) {
          this.freeze$ = this.getDisplayFromBinding(bindings.frozen).pipe(
            map((display) => {
              return {
                context: bindings.frozen.context,
                binding: display,
              };
            }),
          );
        } else {
          this.freeze$ = of();
        }

        const top = bindings.active || bindings.frozen;
        this.initialValue = top ? top.value : undefined;
      },
    );

    this.activeChangeLog$ = this.changeDisplaySections$.pipe(
      map((ls) => {
        return ls.filter((e) => {
          return e.context.resource === this.context && !e.context.element;
        });
      }),
    );
  }

}
