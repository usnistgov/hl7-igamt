import { Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { ChangeType, PropertyType } from '../../../../models/save-change';
import { IResourceRef } from '../../hl7-v2-tree.component';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

export abstract class ReferenceComponent extends HL7v2TreeColumnComponent<IResourceRef> implements OnInit {

  ref: IResourceRef;
  _options: IDisplayElement[];
  selected: IDisplayElement;
  _selection: Subscription;
  @Input()
  set options(opts: IDisplayElement[]) {
    this._options = opts;
    if (this._selection && !this._selection.closed) {
      this._selection.unsubscribe();
    }

    this._selection = this.value$.pipe(
      filter((value) => !!value),
      tap((value) => {
        this.selected = opts.find((elm) => elm.id === value.id);
      }),
    ).subscribe();
  }

  onInitValue(value: IResourceRef): void {
    this.ref = value;
  }

  constructor(private property: PropertyType) {
    super([property]);
    this.value$.pipe(
      map((value) => {
        this.onInitValue(value);
      }),
    ).subscribe();
  }

  referenceChanged(event: IDisplayElement) {
    this.onChange(this.getInputValue().id, event.id, this.property, ChangeType.UPDATE);
  }

  ngOnInit() {
  }

}
