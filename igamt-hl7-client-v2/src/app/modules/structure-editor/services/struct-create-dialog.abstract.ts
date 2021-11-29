import { MatDialogRef } from '@angular/material';
import { take, tap } from 'rxjs/operators';
import { IUsageOption } from '../../shared/components/hl7-v2-tree/columns/usage/usage.component';
import { IHL7v2TreeNode } from '../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../shared/constants/type.enum';
import { IDisplayElement } from '../../shared/models/display-element.interface';
import { AResourceRepositoryService } from '../../shared/services/resource-repository.service';

export interface IStructCreateDialogResult<T> {
  resource: IDisplayElement;
  structElm: T;
}

export abstract class StructCreateDialog<T> {

  readonly blueprint: T;
  public resource: IDisplayElement;
  public positionOptions: any[];

  constructor(
    public dialogRef: MatDialogRef<StructCreateDialog<T>>,
    private repository: AResourceRepositoryService,
    readonly parent: IHL7v2TreeNode,
    readonly resources: IDisplayElement,
    readonly usageOptions: IUsageOption[],
    readonly root: string,
    readonly type: Type,
    readonly path: string,
    readonly position: number,
    readonly containerSize: number,
  ) {
    this.positionOptions = [];
    for (let i = 1; i <= containerSize + 1; i++) {
      this.positionOptions.push({
        label: i,
        value: i,
      });
    }
  }

  getPathId(position: number): string {
    return (this.path && this.path !== '' ? this.path + '.' : '') + position;
  }

  abstract isValid(): boolean;

  resolve(): IStructCreateDialogResult<T> {
    return {
      resource: this.resource,
      structElm: this.blueprint,
    };
  }

  cancel() {
    this.dialogRef.close();
  }

  done() {
    if (this.isValid()) {
      const value = this.resolve();
      this.repository.hotplug(value.resource).pipe(
        take(1),
        tap((display) => {
          this.dialogRef.close({
            ...value,
            resource: display,
          });
        }),
      ).subscribe();
    }
  }
}
