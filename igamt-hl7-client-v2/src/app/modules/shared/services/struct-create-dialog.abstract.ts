import { MatDialogRef } from '@angular/material';
import { IUsageOption } from '../components/hl7-v2-tree/columns/usage/usage.component';
import { IHL7v2TreeNode } from '../components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../constants/type.enum';
import { IDisplayElement } from '../models/display-element.interface';

export interface IStructCreateDialogResult<T> {
  resource: IDisplayElement;
  structElm: T;
}

export abstract class StructCreateDialog<T> {

  readonly blueprint: T;
  public resource: IDisplayElement;

  constructor(
    public dialogRef: MatDialogRef<StructCreateDialog<T>>,
    readonly parent: IHL7v2TreeNode,
    readonly resources: IDisplayElement,
    readonly usageOptions: IUsageOption[],
    readonly root: string,
    readonly type: Type,
    readonly path: string,
    readonly position: number,
  ) { }

  getPathId(): string {
    return (this.path && this.path !== '' ? this.path + '.' : '') + this.position;
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
      this.dialogRef.close(this.resolve());
    }
  }
}
