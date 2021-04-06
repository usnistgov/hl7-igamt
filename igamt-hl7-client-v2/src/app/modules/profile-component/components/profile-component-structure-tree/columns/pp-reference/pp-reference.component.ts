import { Input, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GroupOptions } from 'src/app/modules/shared/components/hl7-v2-tree/columns/reference/reference.component';
import { IResourceRef } from 'src/app/modules/shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { PropertyType } from 'src/app/modules/shared/models/save-change';
import { PPColumn } from '../pp-column.component';

export abstract class PpReferenceComponent extends PPColumn<IResourceRef> implements OnInit {

  ref: IResourceRef;
  _options: GroupOptions;
  all: BehaviorSubject<IDisplayElement[]>;
  selected: IDisplayElement;
  _selection: Subscription;
  editMode: boolean;
  @Input()
  anchor: TemplateRef<any>;

  @Input()
  set options(opts: IDisplayElement[]) {
    this.all.next(opts);
  }

  select(options: IDisplayElement[], id: string) {
    this.editMode = false;
    this.selected = options.find((elm) => elm.id === id);
    this._options = this.filter(options, this.selected);
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

  constructor(private property: PropertyType, protected dialog: MatDialog) {
    super([property], dialog);
    this.all = new BehaviorSubject([]);
    combineLatest(
      this.all,
      this.effectiveValue$,
    ).pipe(
      map(([options, value]) => {
        if (value) {
          this.onInitValue(value);
          this.select(options, value.id);
        }
      }),
    ).subscribe();
  }

  abstract filter(opts: IDisplayElement[], selected: IDisplayElement): GroupOptions;

  abstract referenceChanged(event: IDisplayElement);

  ngOnInit() {
  }

}
