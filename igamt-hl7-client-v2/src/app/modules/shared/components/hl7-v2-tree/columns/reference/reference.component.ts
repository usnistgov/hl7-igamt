import { Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable, of, ReplaySubject, Subscription } from 'rxjs';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { IChange } from 'src/app/modules/shared/models/save-change';
import { IResource } from '../../../../models/resource.interface';
import { ChangeType, PropertyType } from '../../../../models/save-change';
import { ISlicing } from '../../../../models/slicing';
import { IChangeReasonDialogDisplay } from '../../../change-reason-dialog/change-reason-dialog.component';
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
  all: IDisplayElement[];
  selected: IDisplayElement;
  _selection: Subscription;
  editMode: boolean;

  @Input()
  anchor: TemplateRef<any>;
  @Input()
  slicing: ISlicing;
  @Input()
  set resource(resource: IResource) {
    this.resource$.next(resource);
  }

  @ViewChild('display', { read: TemplateRef })
  displayTemplate: TemplateRef<any>;
  resource$: ReplaySubject<IResource>;

  @Input()
  set options(opts: IDisplayElement[]) {
    this.all = opts;
    if (this._selection && !this._selection.closed) {
      this._selection.unsubscribe();
    }

    this._selection = this.value$.pipe(
      filter((value) => !!value),
      withLatestFrom(this.resource$),
      tap(([value, resource]) => {
        this.editMode = false;
        this.selected = opts.find((elm) => elm.id === value.id);
        this._options = this.filter(opts, this.selected, resource);
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

  constructor(private property: PropertyType, protected dialog: MatDialog) {
    super([property], dialog);
    this.resource$ = new ReplaySubject(1);
    this.value$.pipe(
      map((value) => {
        this.onInitValue(value);
      }),
    ).subscribe();
  }

  abstract filter(opts: IDisplayElement[], selected: IDisplayElement, resource?: IResource): GroupOptions;

  referenceChanged(event: IDisplayElement) {
    this.onChange(this.getInputValue(), {
      id: event.id,
      type: event.type,
      name: event.fixedName,
      version: event.domainInfo.version,
    }, this.property, ChangeType.UPDATE);
    this.toggleEdit();
  }

  isActualChange(change: IChange<any>): boolean {
    if (!change.propertyType && !change.oldPropertyValue) {
      return false;
    } else if (change.propertyType && change.oldPropertyValue) {
      return change.propertyValue.id !== change.oldPropertyValue.id;
    } else {
      return true;
    }
  }

  getDisplayTemplateForProperty(change: IChange): Observable<IChangeReasonDialogDisplay> {
    return of({
      current: {
        template: this.displayTemplate,
        context: this.all.find((elm) => elm.id === change.propertyValue.id),
      },
      previous: {
        template: this.displayTemplate,
        context: this.all.find((elm) => elm.id === change.oldPropertyValue.id),
      },
    });
  }

  ngOnInit() {
  }

}
