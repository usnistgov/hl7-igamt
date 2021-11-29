import { Input, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { of, Subscription } from 'rxjs';
import { filter, flatMap, map, take, tap } from 'rxjs/operators';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { IResourceRef } from '../../../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../../../shared/constants/type.enum';
import { ISegmentRef } from '../../../../../shared/models/conformance-profile.interface';
import { ChangeType, PropertyType } from '../../../../../shared/models/save-change';
import { IField } from '../../../../../shared/models/segment.interface';
import { AResourceRepositoryService } from '../../../../../shared/services/resource-repository.service';
import { ResourceSelectDialogComponent } from '../../dialogs/resource-select-dialog/resource-select-dialog.component';
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
  selected: IDisplayElement;
  _selection: Subscription;
  @Input()
  anchor: TemplateRef<any>;
  @Input()
  repository: AResourceRepositoryService;

  @Input()
  set options(opts: IDisplayElement[]) {
    this._selection = this.value$.pipe(
      filter((value) => !!value),
      tap((value) => {
        this.selected = opts.find((elm) => elm.id === value.id);
      }),
    ).subscribe();
  }

  edit() {
    this.dialog.open(ResourceSelectDialogComponent, {
      data: {
        type: this.resourceType,
      },
    }).afterClosed().pipe(
      flatMap((value: IDisplayElement) => {
        if (value) {
          return this.repository.hotplug(value).pipe(
            take(1),
            tap((display) => {
              this.referenceChanged(display);
            }),
          );
        }
        return of();
      }),
    ).subscribe();
  }

  onInitValue(value: IResourceRef): void {
    this.ref = value;
  }

  constructor(private property: PropertyType, protected dialog: MatDialog, protected resourceType: Type) {
    super([property], dialog);
    this.value$.pipe(
      map((value) => {
        this.onInitValue(value);
      }),
    ).subscribe();
  }

  referenceChanged(event: IDisplayElement) {
    this.applyToTarget<ISegmentRef | IField>((elm) => {
      if (this.property === PropertyType.SEGMENTREF) {
        elm.name = event.fixedName;
      }

      elm.ref = {
        id: event.id,
      };
    });

    this.onChange(this.getInputValue(), {
      id: event.id,
      type: event.type,
      name: event.fixedName,
      version: event.domainInfo.version,
    }, this.property, ChangeType.UPDATE);
  }

  ngOnInit() {
  }

}
