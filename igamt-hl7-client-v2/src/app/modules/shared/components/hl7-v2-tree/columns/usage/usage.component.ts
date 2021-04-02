import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { IChange } from 'src/app/modules/shared/models/save-change';
import { Usage } from '../../../../constants/usage.enum';
import { IDocumentRef } from '../../../../models/abstract-domain.interface';
import { Hl7Config } from '../../../../models/config.class';
import { IAssertionPredicate, IPredicate } from '../../../../models/predicate.interface';
import { IResource } from '../../../../models/resource.interface';
import { ChangeType, PropertyType } from '../../../../models/save-change';
import { ElementNamingService } from '../../../../services/element-naming.service';
import { AResourceRepositoryService } from '../../../../services/resource-repository.service';
import { IBinding, StructureElementBindingService } from '../../../../services/structure-element-binding.service';
import { IChangeReasonDialogDisplay } from '../../../change-reason-dialog/change-reason-dialog.component';
import { CsDialogComponent } from '../../../cs-dialog/cs-dialog.component';
import { IStringValue } from '../../hl7-v2-tree.component';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

export interface IUsageOption {
  label: string;
  value: Usage;
}

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.scss'],
})
export class UsageComponent extends HL7v2TreeColumnComponent<IStringValue> implements OnInit {

  options: IUsageOption[];

  usage: IStringValue;
  @Input()
  anchor: TemplateRef<any>;
  editablePredicate: BehaviorSubject<{ value: IPredicate }>;
  editablePredicate$: Observable<{ value: IPredicate }>;
  freezePredicate$: Observable<IBinding<IPredicate>>;
  initial: IPredicate;
  @Input()
  resource: Observable<IResource>;
  @Input()
  repository: AResourceRepositoryService;

  @Input()
  set usages({ original, config }: { original: Usage, config: Hl7Config }) {
    const includeW = original === 'W';
    const includeB = original === 'B';
    this.options = Hl7Config.getUsageOptions(config.usages, includeW, includeB);
  }

  @Input()
  set predicate({ documentRef, predicates }: { documentRef: IDocumentRef, predicates: Array<IBinding<IPredicate>> }) {
    const bindings = this.structureElementBindingService.getActiveAndFrozenBindings(predicates, { resource: this.context });

    this.editablePredicate.next({ value: bindings.active ? bindings.active.value : undefined });
    this.freezePredicate$ = of(bindings.frozen).pipe(
      filter((value) => !!value),
    );

    const top = bindings.active || bindings.frozen;
    this.initial = top ? top.value : undefined;
  }

  constructor(
    private structureElementBindingService: StructureElementBindingService,
    private elementNamingService: ElementNamingService,
    dialog: MatDialog) {
    super([PropertyType.USAGE, PropertyType.PREDICATE], dialog);
    this.value$.asObservable().subscribe(
      (value) => {
        this.usage = {
          ...value,
        };
      },
    );
    this.editablePredicate = new BehaviorSubject({ value: undefined });
    this.editablePredicate$ = this.editablePredicate.asObservable();
  }

  createPredicateDialog() {
    this.resource.pipe(
      take(1),
      tap((resource) => {
        this.elementNamingService.getPathInfoFromPathId(resource, this.repository, this.location).pipe(
          take(1),
          tap((pathInfo) => {
            this.openDialog('Create Predicate for ' + this.elementNamingService.getStringNameFromPathInfo(pathInfo), undefined);
          }),
        ).subscribe();
      }),
    ).subscribe();
  }

  editPredicateDialog(predicate: IPredicate) {
    this.resource.pipe(
      take(1),
      tap((resource) => {
        this.elementNamingService.getPathInfoFromPathId(resource, this.repository, this.location).pipe(
          take(1),
          tap((path) => {
            this.openDialog('Edit Predicate for ' + this.elementNamingService.getStringNameFromPathInfo(path), predicate);
          }),
        ).subscribe();
      }),
    ).subscribe();
  }

  createOrUpdate(predicate: IPredicate) {
    if (this.initial) {
      this.onChange(this.initial, {
        ...this.initial,
        ...predicate,
      }, PropertyType.PREDICATE, ChangeType.UPDATE);
    } else {
      this.onChange(this.initial, predicate, PropertyType.PREDICATE, ChangeType.ADD);
    }
  }

  delete(skipReason: boolean = false) {
    this.onChange(this.initial, undefined, PropertyType.PREDICATE, ChangeType.DELETE, skipReason);
  }

  openDialog(title: string, predicate: IPredicate) {
    const dialogRef = this.dialog.open(CsDialogComponent, {
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        title,
        predicateMode: true,
        predicateElementId: this.location,
        resource: this.resource,
        payload: predicate ? _.cloneDeep(predicate) : undefined,
      },
    });

    dialogRef.afterClosed().subscribe(
      (changed) => {
        if (changed) {
          this.editablePredicate.next({ value: changed });
          this.createOrUpdate(changed);
        }
      },
    );
  }

  clear(skipReason: boolean = false) {
    this.delete(skipReason);
    this.editablePredicate.next({ value: undefined });
  }

  modelChange(event: any): void {
    if (event.value !== 'CAB') {
      this.clear(true);
    }

    this.onChange<string>(this.getInputValue().value, event.value, PropertyType.USAGE, ChangeType.UPDATE);
  }

  isActualChange(change: IChange<any>): boolean {
    if (change.propertyType === PropertyType.PREDICATE) {
      if (!change.oldPropertyValue && !change.propertyValue) {
        return false;
      } else if (change.oldPropertyValue && change.propertyValue) {
        const old: IAssertionPredicate = change.oldPropertyValue as IAssertionPredicate;
        const value: IAssertionPredicate = change.propertyValue as IAssertionPredicate;
        return old.trueUsage !== value.trueUsage ||
          old.falseUsage !== value.falseUsage ||
          old.assertion.description !== value.assertion.description;
      } else {
        return true;
      }
    } else if (change.propertyType === PropertyType.USAGE) {
      return change.propertyValue !== change.oldPropertyValue;
    }
  }

  getDisplayTemplateForProperty(change: IChange): Observable<IChangeReasonDialogDisplay> {
    return change.propertyType === PropertyType.PREDICATE ? of({
      current: {
        context: change.propertyValue ? change.propertyValue.assertion ? change.propertyValue.assertion.description : change.propertyValue.freeText : '',
      },
      previous: {
        context: change.oldPropertyValue ? change.oldPropertyValue.assertion ? change.oldPropertyValue.assertion.description : change.oldPropertyValue.freeText : '',
      },
    }) : null;
  }

  ngOnInit() {
  }

}
