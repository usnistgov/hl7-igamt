import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { selectIgId } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { TurnOnLoader, TurnOffLoader } from '../../../../root-store/loader/loader.actions';
import { ValueSetService } from '../../../value-set/service/value-set.service';
import { IBindingType, IValuesetStrength } from '../../models/binding.interface';
import { IDisplayElement } from '../../models/display-element.interface';
import { ICodes, IValueSet } from '../../models/value-set.interface';

@Component({
  selector: 'app-binding-selector',
  templateUrl: './binding-selector.component.html',
  styleUrls: ['./binding-selector.component.css'],
})
export class BindingSelectorComponent<T> implements OnInit {
  selectedBindingType: IBindingType = IBindingType.VALUESET;
  selectedValueSet: IDisplayElement;
  currentValueSet: IValueSet;
  edit = {};
  editableBinding: IValueSetBindingDisplay;
  temp: IDisplayElement = null;
  selectedSingleCode: ISingleCodeDisplay;
  bindingStrengthOptions = [
    { label: 'Required', value: IValuesetStrength.R }, { label: 'Suggested', value: IValuesetStrength.S }, { label: 'Unspecified', value: IValuesetStrength.U },
  ];
  private selectedValueSets: IValueSetBindingDisplay[] = [];

  constructor(
    public dialogRef: MatDialogRef<BindingSelectorComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public data: IBindingSelectorData,
    private valueSetService: ValueSetService,
    private store: Store<any>) {
    this.selectedBindingType = this.data.existingBindingType ? this.data.existingBindingType : IBindingType.VALUESET;
    this.selectedSingleCode = this.data.selectedSingleCode;
    this.selectedValueSets = this.data.selectedValueSetBinding;
  }

  submit() {
    let result: IBindingDataResult = { selectedBindingType: this.selectedBindingType };
    switch (this.selectedBindingType) {
      case IBindingType.SINGLECODE:
        result = { ...result, selectedSingleCode: this.selectedSingleCode };
        break;
      case IBindingType.VALUESET:
        result = { ...result, selectedValueSets: this.selectedValueSets };
        break;
    }
    this.dialogRef.close(result);
  }

  cancel() {
    this.dialogRef.close();
  }
  addBinding() {
    if (!this.selectedValueSets) {
      this.selectedValueSets = [];
    }
    this.editableBinding = { valueSets: [], bindingStrength: IValuesetStrength.R, bindingLocation: this.getDefaultBindinglcation() };
    this.selectedValueSets.push(this.editableBinding);
  }
  submitValueSet(binding: IValueSetBindingDisplay, vs: IDisplayElement) {
    if (!binding.valueSets.filter((x) => x.id === vs.id).length) {
      binding.valueSets.push(vs);
    }
    this.temp = null;
    this.edit = {};
  }
  addValueSet(binding: IValueSetBindingDisplay, index) {
    this.edit[index] = true;
    this.temp = null;
  }
  removeValueSet(binding: IValueSetBindingDisplay, index: number) {
    binding.valueSets.splice(index, 1);
  }
  getDefaultBindinglcation() {
    if (this.data.locationInfo.allowedBindingLocations && this.data.locationInfo.allowedBindingLocations.length === 1) {
      return [... this.data.locationInfo.allowedBindingLocations[0].value];
    } else {
      return [];
    }
  }

  ngOnInit() {
  }

  loadCodes($event) {
    this.store.dispatch(new TurnOnLoader({ blockUI: true }));
    this.getById($event.id).subscribe(
      (x) => {
        this.store.dispatch(new TurnOffLoader());
        this.currentValueSet = x;
      },
      () => {
        this.store.dispatch(new TurnOffLoader());
      },
    );
  }

  getById(id: string): Observable<IValueSet> {
    return this.store.select(selectIgId).pipe(
      take(1),
      mergeMap((x) => {
        return this.valueSetService.getById(x, id);
      }),
    );
  }

  selectCode(code: ICodes) {
    this.selectedSingleCode = { valueSet: this.selectedValueSet, code: code.value, codeSystem: code.codeSystem };
  }

  clearCode() {
    this.selectedSingleCode = null;
  }

  removeBinding(index: number) {
    this.selectedValueSets.splice(index, 1);
  }
}

export interface IBindingLocationItem {
  label: string;
  value: number[];
}

export interface IBindingLocationInfo {
  allowedBindingLocations: IBindingLocationItem[];
  singleCodeAllowed: boolean;
  multiple: boolean;
  coded: boolean;
  allowSingleCode: boolean;
  allowValueSets: boolean;
}

export class IValueSetBindingDisplay {
  valueSets: IDisplayElement[];
  bindingStrength: IValuesetStrength;
  bindingLocation?: number[];
}

export class ISingleCodeDisplay {
  valueSet: IDisplayElement;
  code: string;
  codeSystem: string;
}

export interface IBindingDataResult {
  selectedBindingType?: IBindingType;
  selectedSingleCode?: ISingleCodeDisplay;
  selectedValueSets?: IValueSetBindingDisplay[];
}

export interface IBindingSelectorData {
  resources: IDisplayElement[];
  locationInfo: IBindingLocationInfo;
  path: string;
  existingBindingType: IBindingType;
  selectedValueSetBinding: IValueSetBindingDisplay[];
  selectedSingleCode: ISingleCodeDisplay;
}
