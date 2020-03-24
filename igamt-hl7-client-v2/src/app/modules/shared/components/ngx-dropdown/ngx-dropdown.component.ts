import { Component, ContentChild, forwardRef, Input, OnInit, TemplateRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export enum ValueType {
  Standard = 'Standard',
  Entity = 'Entity',
}

export interface IStandardItem {
  label: string;
  value: any;
}

export interface IEntityItem {
  id: string;
  [key: string]: any;
}

export interface IControls<T> {
  pick: (item: T) => any;
  compare: (item: T, value: T) => boolean;
  getItemByValue: (items: T[], value: any) => T;
}

@Component({
  selector: 'app-ngx-dropdown',
  templateUrl: './ngx-dropdown.component.html',
  styleUrls: ['./ngx-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxDropdownComponent),
      multi: true,
    },
  ],
})
export class NgxDropdownComponent implements ControlValueAccessor, OnInit {

  @ContentChild('selected', { read: TemplateRef }) selectedTemplate: TemplateRef<any>;
  @ContentChild('item', { read: TemplateRef }) itemTemplate: TemplateRef<any>;
  standardControls: IControls<IStandardItem> = {
    pick: (selected: IStandardItem) => {
      return selected.value;
    },
    compare: (item: IStandardItem, value: IStandardItem) => {
      return value && JSON.stringify(item.value) === JSON.stringify(value.value);
    },
    getItemByValue: (items: IStandardItem[], value: any) => {
      return items.find((elm) => JSON.stringify(elm.value) === JSON.stringify(value));
    },
  };

  entityControls: IControls<IEntityItem> = {
    pick: (selected: IEntityItem) => {
      return selected;
    },
    compare: (item: IEntityItem, value: IEntityItem) => {
      return value && item.id === value.id;
    },
    getItemByValue: (items: IEntityItem[], value: any) => {
      return value && items.find((elm) => elm.id === value.id);
    },
  };

  @Input()
  set type(t: ValueType) {
    switch (t) {
      case ValueType.Standard:
        this.controls = this.standardControls;
        break;
      case ValueType.Entity:
        this.controls = this.entityControls;
        break;
    }
    this._type = t;
  }

  @Input()
  controls: IControls<any> = this.standardControls;
  @Input()
  group: boolean;
  @Input()
  searchTxt: string;
  @Input()
  set values(vals: any[]) {
    this._values = vals;
    this._filtered = [...this._values];
    if (this.writtenValue) {
      this.initSelectedItem(this.writtenValue);
    }
  }
  @Input()
  placeholder: string;
  @Input()
  filter: boolean;
  @Input()
  filterFn: (str: string, values: any[]) => any[];
  @Input()
  id: string;
  @Input()
  name: string;
  @Input()
  required: boolean;
  writtenValue: any;
  filterTxt = '';
  changeFn: any;
  touchedFn: any;
  disabled: boolean;
  selected: any;
  selectedItem: any;
  _type: ValueType;
  _values: any[];
  _filtered: any[];

  doFilter(str: string) {
    if (this.filterFn) {
      this._filtered = this.filterFn(str, this._values);
    }
  }

  doChange($event) {
    this.selectedItem = $event.value;
    this.changeFn(this.controls.pick($event.value));
  }

  writeValue(value: any): void {
    this.writtenValue = value;
    if (value) {
      this.initSelectedItem(value);
    }
  }

  initSelectedItem(value) {
    this.selectedItem = this.controls.getItemByValue(this._values, value);
    this.selected = this.selectedItem;
  }

  registerOnChange(fn: any): void {
    this.changeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.touchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit() {
  }

}
