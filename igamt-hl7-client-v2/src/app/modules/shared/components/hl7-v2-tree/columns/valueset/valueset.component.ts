import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { filter, map, take, takeWhile, tap } from 'rxjs/operators';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { IChange } from 'src/app/modules/shared/models/save-change';
import { Type } from '../../../../constants/type.enum';
import { IBindingType, InternalSingleCode, IValuesetBinding } from '../../../../models/binding.interface';
import {IResource} from '../../../../models/resource.interface';
import { ChangeType, PropertyType } from '../../../../models/save-change';
import { BindingService } from '../../../../services/binding.service';
import { AResourceRepositoryService } from '../../../../services/resource-repository.service';
import { IBinding, IBindingContext, StructureElementBindingService } from '../../../../services/structure-element-binding.service';
import {
  BindingSelectorComponent,
  IBindingLocationInfo,
  ISingleCodeDisplay,
} from '../../../binding-selector/binding-selector.component';
import { IValueSetBindingDisplay } from '../../../binding-selector/binding-selector.component';
import { IChangeReasonDialogDisplay } from '../../../change-reason-dialog/change-reason-dialog.component';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

export interface IValueSetOrSingleCodeBindings {
  valueSetBindings: Array<IBinding<IValuesetBinding[]>>;
  singleCodeBindings: Array<IBinding<InternalSingleCode>>;
}

export interface IValueSetOrSingleCode {
  type: IBindingType;
  value: IValuesetBinding[] | InternalSingleCode;
}

export interface IValueSetOrSingleCodeDisplay {
  type: IBindingType;
  value: IValueSetBindingDisplay[] | ISingleCodeDisplay;
}

@Component({
  selector: 'app-valueset',
  templateUrl: './valueset.component.html',
  styleUrls: ['./valueset.component.scss'],
})
export class ValuesetComponent extends HL7v2TreeColumnComponent<IValueSetOrSingleCodeBindings> implements OnInit, OnDestroy {

  bindings: Array<IBinding<IValueSetOrSingleCode>>;
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
  context: Type;
  @Input()
  resource: IResource;

  @ViewChild('displayVsBindingList', { read: TemplateRef })
  displayVsBindingListTemplate: TemplateRef<any>;
  @ViewChild('displayScBinding', { read: TemplateRef })
  displaySingleCodeTemplate: TemplateRef<any>;
  alive: boolean;

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

  selectedSingleCode(vsOrCode: IValueSetOrSingleCodeDisplay): ISingleCodeDisplay {
    if (vsOrCode && vsOrCode.type === IBindingType.SINGLECODE) {
      return _.cloneDeep(vsOrCode.value) as ISingleCodeDisplay;
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
        selectedSingleCode: this.selectedSingleCode(this.editable.getValue()),
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
            this.singleCodeChange(selection.selectedSingleCode);
            this.editable.next({
              type: IBindingType.SINGLECODE,
              value: selection.selectedSingleCode,
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

    if (change && change.length > 0) {
      this.singleCodeChange(undefined, true);
    }
  }

  isActualChange(change: IChange<any>): boolean {
    return true;
  }

  singleCodeChange(change: ISingleCodeDisplay, skipReason: boolean = false) {
    this.onChange(
      this.initialValue ? this.initialValue.type === IBindingType.SINGLECODE ? this.initialValue.value : undefined : undefined,
      change ? {
        code: change.code,
        codeSystem: change.codeSystem,
        valueSetId: change.valueSet.id,
      } : undefined,
      PropertyType.SINGLECODE,
      ChangeType.UPDATE,
      skipReason,
    );
    if (change) {
      this.vsBindingsChange([], true);
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
        return this.bindingService.getSingleCodeBindingDisplay(binding.value.value as InternalSingleCode, this.repository).pipe(
          take(1),
          map((sg) => {
            return {
              type: IBindingType.SINGLECODE,
              value: sg,
            };
          }),
        );
    }
  }

  getDisplayTemplateForProperty(change: IChange): Observable<IChangeReasonDialogDisplay> {
    const context = { resource: this.context };
    console.log(change);
    switch (change.propertyType) {
      case PropertyType.SINGLECODE:
        return combineLatest(
          change.oldPropertyValue ? this.bindingService.getSingleCodeBindingDisplay(change.oldPropertyValue, this.repository) : of(undefined),
          change.propertyValue ? this.bindingService.getSingleCodeBindingDisplay(change.propertyValue, this.repository) : of(undefined),
        ).pipe(
          take(1),
          map(([previous, current]) => {
            return {
              current: {
                context: {
                  context,
                  value: current,
                },
                template: this.displaySingleCodeTemplate,
              },
              previous: {
                context: {
                  context,
                  value: previous,
                },
                template: this.displaySingleCodeTemplate,
              },
            };
          }),
        );
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
    this.alive = true;
    this.value$.pipe(
      takeWhile(() => this.alive),
    ).subscribe(
      (vsOrSingleCode) => {
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
  }

}
