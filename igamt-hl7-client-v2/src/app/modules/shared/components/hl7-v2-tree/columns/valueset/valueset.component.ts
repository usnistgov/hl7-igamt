import { Component, Input, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import { Observable } from 'rxjs';
import {filter, tap} from 'rxjs/operators';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { Type } from '../../../../constants/type.enum';
import {IBindingType, IValuesetBinding} from '../../../../models/binding.interface';
import {IBindingInfo, IValueSetBindingConfigMap} from '../../../../models/config.class';
import { PropertyType } from '../../../../models/save-change';
import {BindingService} from '../../../../services/binding.service';
import { IBinding } from '../../../../services/hl7-v2-tree.service';
import { AResourceRepositoryService } from '../../../../services/resource-repository.service';
import {
  BindingSelectorComponent,
  IBindingLocationInfo, ISingleCodeDisplay,
  IValueSetBindingDisplay,
} from '../../../binding-selector/binding-selector.component';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

@Component({
  selector: 'app-valueset',
  templateUrl: './valueset.component.html',
  styleUrls: ['./valueset.component.scss'],
})
export class ValuesetComponent extends HL7v2TreeColumnComponent<IBinding<IValuesetBinding[]>> implements OnInit {

  valueSetBindings: IBinding<IValuesetBinding[]>;
  @Input()
  valueSets: IDisplayElement[];
  @Input()
  bindingConfig: IValueSetBindingConfigMap;
  @Input()
  repository: AResourceRepositoryService;

  constructor( private dialog: MatDialog, private bindingService: BindingService) {
    super([PropertyType.VALUESET]);
    this.value$.subscribe(
      (value) => this.valueSetBindings = value,
    );
  }
  getValueSetById(id: string): Observable<IDisplayElement> {
    return this.repository.getResourceDisplay(Type.VALUESET, id);
  }
  ngOnInit() {
  }

  editBinding() {

    const locationInfo: IBindingLocationInfo =  this.bindingService.getBingdingInfo('2.3.1', 'HD', 1, Type.DATATYPE, this.bindingConfig);
    console.log(locationInfo);
    const dialogRef = this.dialog.open(BindingSelectorComponent, {
      data: { resources: this.valueSets, locationInfo, path: null,  current: this.valueSetBindings},
    });
    dialogRef.afterClosed().pipe(
      filter((x) => x !== undefined),
      tap((x) => console.log(x)),
    ).subscribe();
  }
}
