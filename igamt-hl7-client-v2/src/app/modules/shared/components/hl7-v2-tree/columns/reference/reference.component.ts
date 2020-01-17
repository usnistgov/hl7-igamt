import { Input, OnInit, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { ChangeType, PropertyType } from '../../../../models/save-change';
import { IResourceRef } from '../../hl7-v2-tree.component';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

export type GroupOptions = Array<{
  label: string,
  items: Array<{
    label: string,
    value: IDisplayElement,
  }>,
}>;

export abstract class ReferenceComponent extends HL7v2TreeColumnComponent<IResourceRef> implements OnInit {

  ref: IResourceRef;
  _options: GroupOptions;
  selected: IDisplayElement;
  _selection: Subscription;
  editMode: boolean;

  @Input()
  anchor: TemplateRef<any>;

  @Input()
  set options(opts: IDisplayElement[]) {
    if (this._selection && !this._selection.closed) {
      this._selection.unsubscribe();
    }

    this._selection = this.value$.pipe(
      filter((value) => !!value),
      tap((value) => {
        this.editMode = false;
        this.selected = opts.find((elm) => elm.id === value.id);
        this._options = this.filter(opts, this.selected);
      }),
    ).subscribe();
  }

  sort(a, b) {
    if (a.value.fixedName > b.value.fixedName) {
      return 1;
    } else if (a.value.fixedName < b.value.fixedName) {
      return -1;
    } else {
      if (a.value.variableName > b.value.variableName) {
        return 1;
      } else if (a.value.variableName < b.value.variableName) {
        return -1;
      } else {
        return 0;
      }
    }
  }

  toggleEdit() {
    this.editMode = !this.editMode;
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

  abstract filter(opts: IDisplayElement[], selected: IDisplayElement): GroupOptions;

  referenceChanged(event: IDisplayElement) {
    this.onChange(this.getInputValue(), {
      id: event.id,
      type: event.type,
      name: event.fixedName,
      version: event.domainInfo.version,
    }, this.property, ChangeType.UPDATE);
    this.toggleEdit();
  }

  ngOnInit() {
  }

}
