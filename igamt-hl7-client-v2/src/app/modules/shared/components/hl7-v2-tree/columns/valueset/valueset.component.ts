import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { combineLatest, forkJoin, Observable, of, Subject } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { Type } from '../../../../constants/type.enum';
import { IValuesetBinding } from '../../../../models/binding.interface';
import { PropertyType } from '../../../../models/save-change';
import { Hl7V2TreeService, IBinding, IBindingContext } from '../../../../services/hl7-v2-tree.service';
import { AResourceRepositoryService } from '../../../../services/resource-repository.service';
import {
  BindingSelectorComponent,
  IBindingLocationInfo,
} from '../../../binding-selector/binding-selector.component';
import { IValueSetBindingDisplay } from '../../../binding-selector/binding-selector.component';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

@Component({
  selector: 'app-valueset',
  templateUrl: './valueset.component.html',
  styleUrls: ['./valueset.component.scss'],
})
export class ValuesetComponent extends HL7v2TreeColumnComponent<Array<IBinding<IValuesetBinding[]>>> implements OnInit {

  valueSetBindings: IBinding<IValuesetBinding[]>;
  vsBindingsList: Array<IBinding<IValuesetBinding[]>>;
  freezeList: Observable<{
    context: IBindingContext,
    vsList: IValueSetBindingDisplay[],
  }>;
  editableList: Subject<IValueSetBindingDisplay[]>;
  editList$: Observable<IValueSetBindingDisplay[]>;
  @Input()
  valueSets: IDisplayElement[];
  @Input()
  bindingInfo: IBindingLocationInfo;
  @Input()
  repository: AResourceRepositoryService;
  @Input()
  context: Type;

  constructor(private dialog: MatDialog, private treeService: Hl7V2TreeService) {
    super([PropertyType.VALUESET]);
    this.editableList = new Subject<IValueSetBindingDisplay[]>();
    this.editList$ = this.editableList.asObservable();
  }

  getValueSetBindingDisplay(bindings: IValuesetBinding[]): Observable<IValueSetBindingDisplay[]> {
    return forkJoin(bindings.map((x) =>
      combineLatest(
        of(x),
        this.getValueSetById(x.valuesetId).pipe(
          take(1),
        ),
      ))).pipe(
        map((vsList) => {
          return vsList.map((vsB) => {
            const [binding, display] = vsB;
            return {
              display,
              bindingStrength: binding.strength,
              bindingLocation: binding.valuesetLocations,
            };
          });
        }),
      );
  }

  getValueSetById(id: string): Observable<IDisplayElement> {
    return this.repository.getResourceDisplay(Type.VALUESET, id);
  }

  editBinding() {
    const dialogRef = this.dialog.open(BindingSelectorComponent, {
      data: { resources: this.valueSets, locationInfo: this.bindingInfo, path: null, current: this.valueSetBindings },
    });

    dialogRef.afterClosed().pipe(
      filter((x) => x !== undefined),
      tap((x) => console.log(x)),
    ).subscribe();
  }

  ngOnInit() {
    this.value$.subscribe(
      (value) => {
        if (value) {
          this.valueSetBindings = value[0];
          this.vsBindingsList = value;
          const editable = this.treeService.getBindingsForContext<IValuesetBinding[]>({ resource: this.context }, value);
          const freeze = this.treeService.getBindingsAfterContext<IValuesetBinding[]>({ resource: this.context }, value);

          if (editable) {
            this.getValueSetBindingDisplay(editable.value).pipe(
              map((vsDisplay) => {
                this.editableList.next(vsDisplay);
              }),
            );
          }

          if (freeze) {
            this.freezeList = this.getValueSetBindingDisplay(freeze.value).pipe(
              map((vsDisplay) => {
                return {
                  context: freeze.context,
                  vsList: vsDisplay,
                };
              }),
            );
          }
        }
      },
    );
  }

}
