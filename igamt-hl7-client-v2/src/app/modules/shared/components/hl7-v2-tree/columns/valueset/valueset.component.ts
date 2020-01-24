import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject, combineLatest, forkJoin, Observable, of } from 'rxjs';
import { filter, map, take, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { Type } from '../../../../constants/type.enum';
import { IBindingType, InternalSingleCode, IValuesetBinding } from '../../../../models/binding.interface';
import { ChangeType, PropertyType } from '../../../../models/save-change';
import { BindingService } from '../../../../services/binding.service';
import { IBinding, IBindingContext } from '../../../../services/hl7-v2-tree.service';
import { AResourceRepositoryService } from '../../../../services/resource-repository.service';
import {
  BindingSelectorComponent,
  IBindingLocationInfo,
  ISingleCodeDisplay,
} from '../../../binding-selector/binding-selector.component';
import { IValueSetBindingDisplay } from '../../../binding-selector/binding-selector.component';
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
  alive: boolean;

  constructor(
    private dialog: MatDialog,
    private bindingService: BindingService) {
    super([PropertyType.VALUESET, PropertyType.SINGLECODE]);
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
      return vsOrCode.value as IValueSetBindingDisplay[];
    } else {
      return undefined;
    }
  }

  selectedSingleCode(vsOrCode: IValueSetOrSingleCodeDisplay): ISingleCodeDisplay {
    if (vsOrCode && vsOrCode.type === IBindingType.SINGLECODE) {
      return vsOrCode.value as ISingleCodeDisplay;
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

  vsBindingsChange(change: IValueSetBindingDisplay[]) {
    this.onChange(
      this.initialValue ? this.initialValue.type === IBindingType.VALUESET ? this.initialValue.value : undefined : undefined,
      change.map(
        (vs) => this.transform(vs),
      ),
      PropertyType.VALUESET,
      ChangeType.UPDATE,
    );

    if (change && change.length > 0) {
      this.singleCodeChange(undefined);
    }
  }

  singleCodeChange(change: ISingleCodeDisplay) {
    this.onChange(
      this.initialValue ? this.initialValue.type === IBindingType.SINGLECODE ? this.initialValue.value : undefined : undefined,
      change ? {
        code: change.code,
        codeSystem: change.codeSystem,
        valueSetId: change.valueSet.id,
      } : undefined,
      PropertyType.SINGLECODE,
      ChangeType.UPDATE,
    );
    if (change) {
      this.vsBindingsChange([]);
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

  // tslint:disable-next-line: cognitive-complexity
  ngOnInit() {
    this.alive = true;
    this.value$.pipe(
      takeWhile(() => this.alive),
    ).subscribe(
      (vsOrSingleCode) => {
        const value = this.mergeBindings(vsOrSingleCode);

        if (value && value.length > 0) {
          value.sort((a, b) => {
            return a.level - b.level;
          });

          const topBindings = value[0];
          let display: IBinding<IValueSetOrSingleCode> = value.length > 1 ? value[1] : undefined;

          // Editable List
          if (topBindings.level === 1) {
            this.initialValue = topBindings.value;
            switch (topBindings.value.type) {

              case IBindingType.VALUESET:
                this.bindingService.getValueSetBindingDisplay(topBindings.value.value as IValuesetBinding[], this.repository).pipe(
                  takeWhile(() => this.alive),
                  tap((bindings) => {
                    this.editable.next({
                      type: IBindingType.VALUESET,
                      value: bindings,
                    });
                  },
                    takeUntil(this.editable$)),
                ).subscribe();
                break;

              case IBindingType.SINGLECODE:
                const internalSg = (topBindings.value.value as InternalSingleCode);
                this.getValueSetById(internalSg.valueSetId).pipe(
                  takeWhile(() => this.alive),
                  tap((vs) => {
                    this.editable.next({
                      type: IBindingType.SINGLECODE,
                      value: {
                        valueSet: vs,
                        code: internalSg.code,
                        codeSystem: internalSg.codeSystem,
                      },
                    });
                  },
                    takeUntil(this.editable$)),
                ).subscribe();
                break;
            }
          } else {
            display = topBindings;
          }

          // Display List
          if (display) {
            switch (display.value.type) {

              case IBindingType.VALUESET:
                this.freeze$ = this.bindingService.getValueSetBindingDisplay(display.value.value as IValuesetBinding[], this.repository).pipe(
                  takeWhile(() => this.alive),
                  map((bindings) => {
                    return {
                      context: display.context,
                      binding: {
                        type: IBindingType.VALUESET,
                        value: bindings,
                      },
                    };
                  }),
                );
                break;

              case IBindingType.SINGLECODE:
                const internalSg = (display.value.value as InternalSingleCode);
                this.freeze$ = this.getValueSetById(internalSg.valueSetId).pipe(
                  takeWhile(() => this.alive),
                  map((vs) => {
                    return {
                      context: display.context,
                      binding: {
                        type: IBindingType.SINGLECODE,
                        value: {
                          valueSet: vs,
                          code: internalSg.code,
                          codeSystem: internalSg.codeSystem,
                        },
                      },
                    };
                  }),
                );
                break;
            }
          }
        } else {
          this.editable.next({ type: IBindingType.VALUESET, value: undefined });
        }
      },
    );
  }

}
