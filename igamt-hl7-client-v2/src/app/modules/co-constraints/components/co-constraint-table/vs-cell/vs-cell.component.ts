import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { combineLatest } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { BindingSelectorComponent } from 'src/app/modules/shared/components/binding-selector/binding-selector.component';
import { ICoConstraintValueSetCell } from 'src/app/modules/shared/models/co-constraint.interface';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { BindingService } from 'src/app/modules/shared/services/binding.service';
import { StoreResourceRepositoryService } from 'src/app/modules/shared/services/resource-repository.service';
import { CellComponent } from '../cell/cell.component';

@Component({
  selector: 'app-vs-cell',
  templateUrl: './vs-cell.component.html',
  styleUrls: ['./vs-cell.component.scss'],
})
export class VsCellComponent extends CellComponent<ICoConstraintValueSetCell> implements OnInit {

  @Input()
  valueSets: IDisplayElement[];
  @Input()
  excludeBindingStrength: boolean;

  constructor(
    private bindingsService: BindingService,
    private dialog: MatDialog,
    private repository: StoreResourceRepositoryService,
  ) {
    super();
  }

  validate(cell: ICoConstraintValueSetCell): string[] {
    return [];
  }

  openVsPicker(vsCell: ICoConstraintValueSetCell) {
    combineLatest(
      this.bindingsService.getValueSetBindingDisplay(vsCell.bindings, this.repository),
    ).pipe(
      take(1),
      tap(([bindings]) => {
        const dialogRef = this.dialog.open(BindingSelectorComponent, {
          minWidth: '40%',
          minHeight: '40%', data: {
            excludeBindingStrength: this.excludeBindingStrength,
            resources: this.valueSets,
            locationInfo: {
              ...this.elementInfo.bindingInfo,
              singleCodeAllowed: false,
              multiple: false,
              allowSingleCode: false,
            },
            selectedValueSetBinding: bindings,
          },
        });

        dialogRef.afterClosed().subscribe(
          (result) => {
            if (result) {
              vsCell.bindings = result.selectedValueSets.map((element) => {
                return {
                  valueSets: element.valueSets.map((vs) => vs.id),
                  strength: element.bindingStrength,
                  valuesetLocations: element.bindingLocation,
                };
              });
              this.emitChange();
            }
          },
        );
      }),
    ).subscribe();
  }

  getVsById(id: string): IDisplayElement {
    return this.valueSets.find((vs) => {
      return vs.id === id;
    });
  }

  ngOnInit() {
  }
}
