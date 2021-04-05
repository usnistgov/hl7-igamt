import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { combineLatest, Observable, of } from 'rxjs';
import { filter, flatMap, map, take, tap } from 'rxjs/operators';
import { BindingSelectorComponent, IBindingLocationInfo, ISingleCodeDisplay, IValueSetBindingDisplay } from 'src/app/modules/shared/components/binding-selector/binding-selector.component';
import { IValueSetOrSingleCode, IValueSetOrSingleCodeBindings, IValueSetOrSingleCodeDisplay } from 'src/app/modules/shared/components/hl7-v2-tree/columns/valueset/valueset.component';
import { IHL7v2TreeNode } from 'src/app/modules/shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { IBindingType, InternalSingleCode, IValuesetBinding } from 'src/app/modules/shared/models/binding.interface';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { IItemProperty, IPropertySingleCode, IPropertyValueSet } from 'src/app/modules/shared/models/profile.component';
import { IResource } from 'src/app/modules/shared/models/resource.interface';
import { PropertyType } from 'src/app/modules/shared/models/save-change';
import { BindingService } from 'src/app/modules/shared/services/binding.service';
import { ElementNamingService } from 'src/app/modules/shared/services/element-naming.service';
import { Hl7V2TreeService } from 'src/app/modules/shared/services/hl7-v2-tree.service';
import { PathService } from 'src/app/modules/shared/services/path.service';
import { AResourceRepositoryService } from 'src/app/modules/shared/services/resource-repository.service';
import { IBinding, IBindingContext, StructureElementBindingService } from 'src/app/modules/shared/services/structure-element-binding.service';
import { PPColumn } from '../pp-column.component';

export interface IValueSetOrSingleCodeBinding extends IValueSetOrSingleCode {
  context: IBindingContext;
}

@Component({
  selector: 'app-pp-valueset',
  templateUrl: './pp-valueset.component.html',
  styleUrls: ['./pp-valueset.component.scss'],
})
export class PpValuesetComponent extends PPColumn<IValueSetOrSingleCodeBinding> implements OnInit {

  @Input()
  repository: AResourceRepositoryService;
  @Input()
  bindingInfo: IBindingLocationInfo;
  @Input()
  valueSets: IDisplayElement[];
  @Input()
  tree: IHL7v2TreeNode[];
  @Input()
  resource: IResource;

  bindingLocation: {
    location: string,
    target: string,
  };
  bindingContext: IBindingContext;

  @Input()
  set payload(vsOrSingleCode: IValueSetOrSingleCodeBindings) {
    const value = this.mergeBindings(vsOrSingleCode);
    const bindings = this.structureElementBindingService.getActiveAndFrozenBindings(value, { resource: this.context });
    const top = bindings.active || bindings.frozen;
    this.value$.next(top ? {
      context: top.context,
      ...top.value,
    } : undefined);
  }

  display$: Observable<IValueSetOrSingleCodeDisplay & {
    context: IBindingContext,
  }>;

  constructor(
    private treeService: Hl7V2TreeService,
    private pathService: PathService,
    private elementNamingService: ElementNamingService,
    private bindingService: BindingService,
    private structureElementBindingService: StructureElementBindingService,
    dialog: MatDialog,
  ) {
    super(
      [PropertyType.VALUESET, PropertyType.SINGLECODE],
      dialog,
    );
  }

  apply(values: Record<PropertyType, IItemProperty>) {
    if (values[PropertyType.VALUESET]) {
      this.applied$.next({
        context: this.bindingType(),
        type: IBindingType.VALUESET,
        value: (values[PropertyType.VALUESET] as IPropertyValueSet).valuesetBindings,
      });
    }

    if (values[PropertyType.SINGLECODE]) {
      this.applied$.next({
        context: this.bindingType(),
        type: IBindingType.SINGLECODE,
        value: (values[PropertyType.SINGLECODE] as IPropertySingleCode).internalSingleCode,
      });
    }
  }

  bindingType(): IBindingContext {
    return {
      resource: this.type === Type.FIELD ? Type.SEGMENT : Type.DATATYPE,
      element: this.type === Type.COMPONENT ? Type.FIELD : this.type === Type.SUBCOMPONENT ? Type.COMPONENT : undefined,
    };
  }

  targetLocation() {
    return {
      location: this.getParentLocation(),
      target: this.elementId,
    };
  }

  transform(display: IValueSetBindingDisplay): IValuesetBinding {
    return {
      strength: display.bindingStrength,
      valuesetLocations: display.bindingLocation,
      valueSets: display.valueSets.map((vs) => vs.id),
    };
  }

  clear() {
    const to = this.targetLocation();
    this.onChangeForBinding<IPropertyValueSet>(to.location, to.target, undefined, PropertyType.VALUESET);
    this.onChangeForBinding<IPropertySingleCode>(to.location, to.target, undefined, PropertyType.SINGLECODE);
  }

  changeVsBinding(vsBinding: IValueSetBindingDisplay[]) {
    const to = this.targetLocation();
    this.onChangeForBinding<IPropertyValueSet>(
      to.location,
      to.target,
      {
        valuesetBindings: vsBinding.map((vs) => this.transform(vs)),
        target: to.target,
        propertyKey: PropertyType.VALUESET,
      },
      PropertyType.VALUESET,
    );
  }

  changeSingleCode(sgCode: ISingleCodeDisplay) {
    const to = this.targetLocation();
    this.onChangeForBinding<IPropertySingleCode>(
      to.location,
      to.target,
      {
        internalSingleCode: {
          code: sgCode.code,
          codeSystem: sgCode.codeSystem,
          valueSetId: sgCode.valueSet.id,
        },
        target: to.target,
        propertyKey: PropertyType.SINGLECODE,
      },
      PropertyType.SINGLECODE,
    );
  }

  activate() {
    this.display$.pipe(
      take(1),
      tap((display) => {
        console.log(display);
        switch (display.type) {
          case IBindingType.VALUESET:
            this.changeVsBinding(display.value as IValueSetBindingDisplay[]);
            break;
          case IBindingType.SINGLECODE:
            this.changeSingleCode(display.value as ISingleCodeDisplay);
            break;
        }
      }),
    ).subscribe();
  }

  getTargetResourceName(path: string): Observable<string> {
    if (path) {
      const pathObj = this.pathService.getPathFromPathId(path);
      return this.treeService.getNodeByPath(this.tree[0].children, pathObj, this.repository).pipe(
        take(1),
        flatMap((node) => {
          return node.$hl7V2TreeHelpers.ref$.pipe(
            take(1),
            map((ref) => ref.name),
          );
        }),
      );
    } else {
      return of(this.resource.name);
    }
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
    combineLatest(
      this.getTargetResourceName(this.bindingLocation.location),
      this.display$,
    ).pipe(
      take(1),
      flatMap(([resourceName, display]) => {
        const dialogRef = this.dialog.open(BindingSelectorComponent, {
          data: {
            resources: this.valueSets,
            locationInfo: this.bindingInfo,
            path: null,
            obx2: resourceName === 'OBX' && this.position === 2,
            existingBindingType: display ? display.type : undefined,
            selectedValueSetBinding: this.selectedValueSetBinding(display),
            selectedSingleCode: this.selectedSingleCode(display),
          },
        });

        return dialogRef.afterClosed().pipe(
          filter((selection) => selection !== undefined),
          tap((selection) => {
            switch (selection.selectedBindingType) {
              case IBindingType.VALUESET:
                this.changeVsBinding(selection.selectedValueSets);
                break;
              case IBindingType.SINGLECODE:
                this.changeSingleCode(selection.selectedSingleCode);
                break;
            }
          }),
        );
      }),
    ).subscribe();
  }

  getDisplayFromBinding(binding: IValueSetOrSingleCode): Observable<IValueSetOrSingleCodeDisplay> {
    switch (binding.type) {

      case IBindingType.VALUESET:
        return this.bindingService.getValueSetBindingDisplay(binding.value as IValuesetBinding[], this.repository).pipe(
          take(1),
          map((bindings) => {
            return {
              type: IBindingType.VALUESET,
              value: bindings,
            };
          }),
        );

      case IBindingType.SINGLECODE:
        return this.bindingService.getSingleCodeBindingDisplay(binding.value as InternalSingleCode, this.repository).pipe(
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

  ngOnInit() {
    this.effectiveValue$.pipe(
      map((value) => {
        if (value) {
          this.display$ = this.getDisplayFromBinding(value).pipe(
            map((display) => {
              return {
                context: value.context,
                ...display,
              };
            }),
          );

          this.bindingContext = this.bindingType();
          this.bindingLocation = this.targetLocation();
        } else {
          this.display$ = of({
            context: this.bindingContext,
            type: IBindingType.VALUESET,
            value: [],
          });
        }
      }),
    ).subscribe();
  }

}
