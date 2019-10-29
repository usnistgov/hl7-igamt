import { Component, Input, OnInit } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { take, tap, mergeMap } from 'rxjs/operators';
import { IValuesetBinding } from 'src/app/modules/shared/models/binding.interface';
import { IValueSetBindingDisplay, BindingSelectorComponent } from '../../../shared/components/binding-selector/binding-selector.component';
import { ICoConstraintValueSetCell, IDataElementHeader } from '../../../shared/models/co-constraint.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { BindingService } from '../../../shared/services/binding.service';
import { AResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-cc-value-set-cell',
  templateUrl: './cc-value-set-cell.component.html',
  styleUrls: ['./cc-value-set-cell.component.scss'],
})
export class CcValueSetCellComponent implements OnInit {

  @Input()
  set bindings(b: IValuesetBinding[]) {
    this.bindings$.next(b);
  }

  @Input()
  repository: AResourceRepositoryService;
  @Input()
  valueSets: IDisplayElement[];

  bindings$: Subject<IValuesetBinding[]>;
  bindingDisplay: IValueSetBindingDisplay[];

  constructor(
    private bindingsService: BindingService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.bindings$.pipe(
      mergeMap((value) => {
        return this.bindingsService.getValueSetBindingDisplay(value, this.repository);
      }),
      tap((value) => {
        this.bindingDisplay = value;
      }),
    ).subscribe();
  }

}
