import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, take, takeWhile, tap } from 'rxjs/operators';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { IBindingLocationInfo, ISingleCodeDisplay, IValueSetBindingDisplay } from '../../../../../shared/components/binding-selector/binding-selector.component';
import { Type } from '../../../../../shared/constants/type.enum';
import { IBindingType, InternalSingleCode, IValuesetBinding } from '../../../../../shared/models/binding.interface';
import { PropertyType } from '../../../../../shared/models/save-change';
import { BindingService } from '../../../../../shared/services/binding.service';
import { AResourceRepositoryService } from '../../../../../shared/services/resource-repository.service';
import { IBinding, IBindingContext, StructureElementBindingService } from '../../../../../shared/services/structure-element-binding.service';
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
  selector: 'app-valueset-simplified',
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
