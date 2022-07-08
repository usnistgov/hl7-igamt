import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ValueSetService } from '../../../value-set/service/value-set.service';
import { IBindingType, IValuesetStrength } from '../../models/binding.interface';
import { IDisplayElement } from '../../models/display-element.interface';
import { ICodes, IValueSet } from '../../models/value-set.interface';
import { VsCodePickerComponent } from '../vs-code-picker/vs-code-picker.component';
import { ISingleCodeBinding } from './../../models/binding.interface';

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
  selectedSingleCodes: ISingleCodeBinding[] = [];
  bindingStrengthOptions = [
    { label: 'Required', value: IValuesetStrength.R },
    { label: 'Suggested', value: IValuesetStrength.S },
    { label: 'Unspecified', value: IValuesetStrength.U },
  ];
  locationInfo: IBindingLocationInfo;
  excludeBindingStrength: boolean;
  private selectedValueSets: IValueSetBindingDisplay[] = [];

  constructor(
    public dialogRef: MatDialogRef<BindingSelectorComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public data: IBindingSelectorData,
    private valueSetService: ValueSetService,
    private dialog: MatDialog,
    private store: Store<any>) {
    this.excludeBindingStrength = data.excludeBindingStrength;
    this.selectedBindingType = this.data.existingBindingType ? this.data.existingBindingType : IBindingType.VALUESET;
    this.selectedSingleCodes = this.data.selectedSingleCodes;
    this.selectedValueSets = this.data.selectedValueSetBinding;
    this.locationInfo = this.data.locationInfo;
  }

  submit() {
    let result: IBindingDataResult = { selectedBindingType: this.selectedBindingType };
    switch (this.selectedBindingType) {
      case IBindingType.SINGLECODE:
        result = { ...result, selectedSingleCodes: this.selectedSingleCodes };
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

  addValueSetBinding() {
    if (!this.selectedValueSets) {
      this.selectedValueSets = [];
    }
    this.selectedValueSets.push({ valueSets: [], bindingStrength: IValuesetStrength.R, bindingLocation: this.getDefaultBindingLocation() });
  }

  pick(index: number) {
    this.dialog.open(VsCodePickerComponent, {
      data: {
        valueSets: this.data.resources,
      },
    }).afterClosed().subscribe(
      (value: ICodes) => {
        if (value) {
          this.selectedSingleCodes[index] = {
            ...this.selectedSingleCodes[index],
            code: value.value,
            codeSystem: value.codeSystem,
          };
        }
      },
    );
  }

  addSingleCodeBinding() {
    if (!this.selectedSingleCodes) {
      this.selectedSingleCodes = [];
    }
    this.selectedSingleCodes.push({ code: '', codeSystem: '', locations: this.getDefaultBindingLocation() });
  }

  submitValueSet(binding: IValueSetBindingDisplay, vs: IDisplayElement) {
    if (binding.valueSets.filter((x) => x.id === vs.id).length === 0) {
      binding.valueSets.push(vs);
    }
    this.temp = null;
    this.edit = {};
  }

  addValueSet(binding: IValueSetBindingDisplay, index: number) {
    this.edit[index] = true;
    this.temp = null;
  }

  removeValueSet(binding: IValueSetBindingDisplay, index: number) {
    binding.valueSets.splice(index, 1);
  }

  getDefaultBindingLocation() {
    if (this.data.locationInfo.allowedBindingLocations && this.data.locationInfo.allowedBindingLocations.length === 1) {
      return [... this.data.locationInfo.allowedBindingLocations[0].value];
    } else {
      return [];
    }
  }

  removeValueSetBinding(index: number) {
    this.selectedValueSets.splice(index, 1);
  }

  removeSingleCodeBinding(index: number) {
    this.selectedSingleCodes.splice(index, 1);
  }

  ngOnInit(): void {
  }
}

export interface IBindingLocationItem {
  label: string;
  value: number[];
}

export interface IBindingLocationInfo {
  allowedBindingLocations: IBindingLocationItem[];
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
  selectedSingleCodes?: ISingleCodeBinding[];
  selectedValueSets?: IValueSetBindingDisplay[];
}

export interface IBindingSelectorData {
  resources: IDisplayElement[];
  locationInfo: IBindingLocationInfo;
  excludeBindingStrength: boolean;
  path?: string;
  obx2?: boolean;
  existingBindingType: IBindingType;
  selectedValueSetBinding: IValueSetBindingDisplay[];
  selectedSingleCodes: ISingleCodeBinding[];
}
