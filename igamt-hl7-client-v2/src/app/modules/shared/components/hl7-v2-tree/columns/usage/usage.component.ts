import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { Type } from '../../../../constants/type.enum';
import { UsageOptions } from '../../../../constants/usage.enum';
import { IPredicate } from '../../../../models/predicate.interface';
import { IResource } from '../../../../models/resource.interface';
import { ChangeType, PropertyType } from '../../../../models/save-change';
import { ConformanceStatementService } from '../../../../services/conformance-statement.service';
import { Hl7V2TreeService, IBinding } from '../../../../services/hl7-v2-tree.service';
import { PredicateService } from '../../../../services/predicate.service';
import { AResourceRepositoryService } from '../../../../services/resource-repository.service';
import { CsDialogComponent } from '../../../cs-dialog/cs-dialog.component';
import { IStringValue } from '../../hl7-v2-tree.component';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.scss'],
})
export class UsageComponent extends HL7v2TreeColumnComponent<IStringValue> implements OnInit {

  options = UsageOptions;

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
  context: Type;

  @Input()
  set predicate({ igId, predicates }: { igId: string, predicates: Array<IBinding<string>> }) {
    if (predicates && predicates.length > 0) {
      predicates.sort((a, b) => {
        return a.level - b.level;
      });

      const top = predicates[0];
      let display: IBinding<string> = predicates.length > 1 ? predicates[1] : undefined;

      if (top.level === 1) {
        this.predicateService.getPredicate(igId, top.value).pipe(
          tap((p: IPredicate) => {
            this.initial = p;
            this.editablePredicate.next({ value: p });
          }),
        ).subscribe();
      } else {
        display = top;
      }

      if (display) {
        this.freezePredicate$ = this.predicateService.getPredicate(igId, display.value).pipe(
          map((p: IPredicate) => {
            return {
              level: display.level,
              context: display.context,
              value: p,
            };
          }),
        );
      }
    } else {
      this.editablePredicate.next({ value: undefined });
    }
  }

  constructor(
    private predicateService: PredicateService,
    private conformanceStatementService: ConformanceStatementService,
    private treeService: Hl7V2TreeService,
    private dialog: MatDialog) {
    super([PropertyType.USAGE, PropertyType.PREDICATE]);
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
        this.treeService.getPathNameWithLocation(resource, this.repository, this.location).pipe(
          take(1),
          tap((path) => {
            this.openDialog('Create Predicate for ' + this.treeService.getNameFromPath(path), this.conformanceStatementService.getFreePredicate());
          }),
        ).subscribe();
      }),
    ).subscribe();
  }

  editPredicateDialog(predicate: IPredicate) {
    this.resource.pipe(
      take(1),
      tap((resource) => {
        this.treeService.getPathNameWithLocation(resource, this.repository, this.location).pipe(
          take(1),
          tap((path) => {
            this.openDialog('Edit Predicate for ' + this.treeService.getNameFromPath(path), predicate);
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

  delete() {
    this.onChange(this.initial, undefined, PropertyType.PREDICATE, ChangeType.DELETE);
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
        payload: predicate,
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

  clear() {
    this.delete();
    this.editablePredicate.next({ value: undefined });
  }

  modelChange(event: any): void {
    this.onChange<string>(this.getInputValue().value, event.value, PropertyType.USAGE, ChangeType.UPDATE);
  }

  ngOnInit() {
  }

}
