import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ICreateProfileComponent} from '../../../document/models/toc/toc-operation.class';
import {ICompositeProfile, IOrderedProfileComponentLink} from '../../models/composite-profile';
import {IDisplayElement} from '../../models/display-element.interface';
import {IProfileComponent} from '../../models/profile.component';

@Component({
  selector: 'app-add-composite',
  templateUrl: './add-composite.component.html',
  styleUrls: ['./add-composite.component.css'],
})
export class AddCompositeComponent implements OnInit {
  model: IAddCompositeComponentModel = {
    name: '',
    coreProfile: null,
    profileComponents: [],
  };
  messages: IDisplayElement[];
  profileComponents: IDisplayElement[];
  coreProfile: IDisplayElement;

  constructor(  public dialogRef: MatDialogRef<AddCompositeComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    this.messages = this.data.messages;
    this.profileComponents = this.data.profileComponents;
  }

  ngOnInit() {
  }

  submit() {
    this.dialogRef.close(this.convert(this.model));
  }
  cancel() {
    this.dialogRef.close();
  }

  modelChange($event: IDisplayElement) {
    this.model.coreProfile = $event;
  }
  private convert(model: IAddCompositeComponentModel)  {
    return {
      name: this.model.name,
      conformanceProfileId: this.coreProfile.id,
      orderedProfileComponents: this.getOrderedPc(this.model.profileComponents),
    };
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
    this.model.profileComponents = $event;
  }
}

export interface IAddCompositeComponentModel {
  name: string;
  coreProfile: IDisplayElement;
  profileComponents: IDisplayElement[];
}
