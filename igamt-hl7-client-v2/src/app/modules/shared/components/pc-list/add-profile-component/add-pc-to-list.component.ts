import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IOrderedProfileComponentLink} from '../../../models/composite-profile';
import {IDisplayElement} from '../../../models/display-element.interface';

@Component({
  selector: 'app-add-pc-to-list-component',
  templateUrl: './add-pc-to-list.component.html',
  styleUrls: ['./add-pc-to-list.component.css'],
})
// tslint:disable-next-line:component-class-suffix
export class AddPcToList implements OnInit {

  addedPcs: IDisplayElement[];
  constructor(  public dialogRef: MatDialogRef<AddPcToList>,
                @Inject(MAT_DIALOG_DATA) public data: {position: number, selected: any, available: IDisplayElement[]  }) {
  }

  ngOnInit() {
  }

  submit() {
    this.dialogRef.close(this.addedPcs);
  }
  cancel() {
    this.dialogRef.close();
  }
  modelChange($event: IDisplayElement) {
  }

  getOrderedPc(profileComponents: IDisplayElement[]): IOrderedProfileComponentLink[] {
    const ret: IOrderedProfileComponentLink[] = [];
    // tslint:disable-next-line:prefer-for-of
    for ( let i = 0; i < profileComponents.length; i++ ) {
      ret.push({profileComponentId: profileComponents[i].id, position: i + 1 });
    }
    return ret;
  }

  onSelect($event: IDisplayElement[]) {
    this.addedPcs = $event;
  }
}
