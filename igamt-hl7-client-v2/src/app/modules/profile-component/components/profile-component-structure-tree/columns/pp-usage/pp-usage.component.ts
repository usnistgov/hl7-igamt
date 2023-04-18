import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { flatMap, map, take, tap } from 'rxjs/operators';
import { CsDialogComponent } from 'src/app/modules/shared/components/cs-dialog/cs-dialog.component';
import { IUsageOption } from 'src/app/modules/shared/components/hl7-v2-tree/columns/usage/usage.component';
import { IHL7v2TreeNode, IStringValue } from 'src/app/modules/shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { Usage } from 'src/app/modules/shared/constants/usage.enum';
import { Hl7Config } from 'src/app/modules/shared/models/config.class';
import { IPredicate } from 'src/app/modules/shared/models/predicate.interface';
import { IItemProperty, IPropertyPredicate, IPropertyUsage } from 'src/app/modules/shared/models/profile.component';
import { IResource } from 'src/app/modules/shared/models/resource.interface';
import { PropertyType } from 'src/app/modules/shared/models/save-change';
import { ElementNamingService } from 'src/app/modules/shared/services/element-naming.service';
import { Hl7V2TreeService } from 'src/app/modules/shared/services/hl7-v2-tree.service';
import { PathService } from 'src/app/modules/shared/services/path.service';
import { AResourceRepositoryService } from 'src/app/modules/shared/services/resource-repository.service';
import { IBinding, IBindingContext, StructureElementBindingService } from 'src/app/modules/shared/services/structure-element-binding.service';
import { PPColumn } from '../pp-column.component';
import { IUserConfig } from './../../../../../shared/models/config.class';

export interface IUsageAndPredicate {
  usage: IStringValue;
  predicate: IPredicate;
}

@Component({
  selector: 'app-pp-usage',
  templateUrl: './pp-usage.component.html',
  styleUrls: ['./pp-usage.component.scss'],
})
export class PpUsageComponent extends PPColumn<IUsageAndPredicate> implements OnInit {

  options: IUsageOption[];
  usage: IStringValue;
  predicate: IPredicate;
  @Input()
  anchor: TemplateRef<any>;
  @Input()
  resource: IResource;
  @Input()
  repository: AResourceRepositoryService;
  @Input()
  tree: IHL7v2TreeNode[];
  predicateBindingLocation: {
    location: string,
    target: string,
  };
  predicateBindingContext: IBindingContext;

  @Input()
  set payload({ usage, predicates }: { usage: IStringValue, predicates: Array<IBinding<IPredicate>> }) {
    const bindings = this.structureElementBindingService.getActiveAndFrozenBindings(predicates, { resource: this.context });
    const top = bindings.active || bindings.frozen;
    this.value$.next({
      usage,
      predicate: top ? top.value : undefined,
    });
  }

  @Input()
  set usages({ original, config, userConfig }: { original: Usage, config: Hl7Config,  userConfig: IUserConfig}) {
    const includeW = original === 'W';
    const includeB = original === 'B';
    const includeIX = (this.usage && this.usage.value === 'IX' || userConfig.includeIX);

    this.options = Hl7Config.getUsageOptions(config.usages, includeW, includeB, includeIX);
  }

  constructor(
    private treeService: Hl7V2TreeService,
    private pathService: PathService,
    private elementNamingService: ElementNamingService,
    private structureElementBindingService: StructureElementBindingService,
    dialog: MatDialog,
  ) {
    super(
      [PropertyType.USAGE],
      dialog,
    );
    this.effectiveValue$.subscribe(
      (value) => {
        if (value) {
          this.usage = {
            ...value.usage,
          };
          this.predicate = value.predicate;

          this.predicateBindingContext = this.predicateBindingType();
          this.predicateBindingLocation = this.predicateTargetLocation(this.predicateBindingContext);
        }
      },
    );
  }

  apply(values: Record<PropertyType, IItemProperty>) {
    if (values[PropertyType.USAGE]) {
      const apply = {
        usage: {
          value: (values[PropertyType.USAGE] as IPropertyUsage).usage,
        },
        predicate: undefined,
      };

      if (values[PropertyType.PREDICATE]) {
        apply.predicate = (values[PropertyType.PREDICATE] as IPropertyPredicate).predicate;
      }

      this.applied$.next(apply);
    }
  }

  usageChange(event: any): void {
    this.onChange<IPropertyUsage>({
      usage: event.value as Usage,
      propertyKey: PropertyType.USAGE,
    },
      PropertyType.USAGE,
    );
    const to = this.predicateBindingLocation;
    this.onChangeForBinding<IPropertyPredicate>(to.location, to.target, undefined, PropertyType.PREDICATE);
  }

  predicateBindingType(): IBindingContext {
    return this.context === Type.CONFORMANCEPROFILE && this.usage.value === Usage.C ? {
      resource: Type.CONFORMANCEPROFILE,
    } : {
        resource: this.type === Type.FIELD ? Type.SEGMENT : Type.DATATYPE,
        element: this.type === Type.COMPONENT ? Type.FIELD : this.type === Type.SUBCOMPONENT ? Type.COMPONENT : undefined,
      };
  }

  predicateTargetLocation(ctx: IBindingContext) {
    return ctx.resource === Type.CONFORMANCEPROFILE ? {
      location: '',
      target: this.location,
    } : {
        location: this.getParentLocation(),
        target: this.elementId,
      };
  }

  activate() {
    this.onChange<IPropertyUsage>({
      usage: this.usage.value as Usage,
      propertyKey: PropertyType.USAGE,
    },
      PropertyType.USAGE,
    );
    if (this.predicate) {
      this.onChangeForBinding<IPropertyPredicate>(
        this.predicateBindingLocation.location,
        this.predicateBindingLocation.target,
        {
          predicate: this.predicate,
          target: this.predicateBindingLocation.target,
          propertyKey: PropertyType.PREDICATE,
        },
        PropertyType.PREDICATE,
      );
    }
  }

  getPathName(resource: IResource, path: string): Observable<string> {
    return this.elementNamingService.getPathInfoFromPathId(resource, this.repository, path).pipe(
      take(1),
      map((pathInfo) => {
        return this.elementNamingService.getStringNameFromPathInfo(pathInfo);
      }),
    );
  }

  getPredicateTarget({ location, target }): Observable<{ resource: IResource, name: string }> {
    if (location) {
      const pathObj = this.pathService.getPathFromPathId(location);
      return this.treeService.getNodeByPath(this.tree[0].children, pathObj, this.repository).pipe(
        take(1),
        flatMap((node) => {
          if (node.data.type === Type.GROUP) {
            return this.getPathName(this.resource, this.location).pipe(
              map((name) => ({
                name,
                resource: this.resource,
              })),
            );
          }

          return node.$hl7V2TreeHelpers.ref$.pipe(
            take(1),
            flatMap((ref) => {
              return this.repository.fetchResource(ref.type, ref.id).pipe(
                take(1),
                flatMap((resource) => {
                  return this.getPathName(resource, target).pipe(
                    map((name) => ({
                      name,
                      resource,
                    })),
                  );
                }),
              );
            }),
          );
        }),
      );
    } else {
      return this.getPathName(this.resource, target).pipe(
        map((name) => ({
          name,
          resource: this.resource,
        })),
      );
    }
  }

  createPredicateDialog() {
    this.getPredicateTarget(this.predicateBindingLocation).pipe(
      tap(({ resource, name }) => {
        this.openDialog(`Create Predicate for ${name}`, resource, undefined);
      }),
    ).subscribe();
  }

  editPredicateDialog(predicate: IPredicate) {
    this.getPredicateTarget(this.predicateBindingLocation).pipe(
      tap(({ resource, name }) => {
        this.openDialog(`Create Predicate for ${name}`, resource, predicate);
      }),
    ).subscribe();
  }

  openDialog(title: string, resource: IResource, predicate: IPredicate) {
    const dialogRef = this.dialog.open(CsDialogComponent, {
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        title,
        predicateMode: true,
        predicateElementId: this.predicateBindingLocation.target,
        resource: of(resource),
        payload: predicate ? _.cloneDeep(predicate) : undefined,
      },
    });

    dialogRef.afterClosed().subscribe(
      (changed) => {
        if (changed) {
          this.onChangeForBinding<IPropertyPredicate>(
            this.predicateBindingLocation.location,
            this.predicateBindingLocation.target,
            {
              predicate: changed,
              target: this.predicateBindingLocation.target,
              propertyKey: PropertyType.PREDICATE,
            },
            PropertyType.PREDICATE,
          );
        }
      },
    );
  }

  clearPredicate() {
    const to = this.predicateBindingLocation;
    this.onChangeForBinding<IPropertyPredicate>(to.location, to.target, undefined, PropertyType.PREDICATE);
  }

  clear() {
    const to = this.predicateBindingLocation;
    this.onChange<IPropertyUsage>(undefined, PropertyType.USAGE);
    this.onChangeForBinding<IPropertyPredicate>(to.location, to.target, undefined, PropertyType.PREDICATE);
    this.applied$.next(undefined);
  }

  ngOnInit() {
  }

}
