import {Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Scope} from '../../constants/scope.enum';
import {Type} from '../../constants/type.enum';
import {IResourcePickerData} from '../../models/resource-picker-data.interface';
import {ResourceService} from '../../services/resource.service';
@Component({
  selector: 'app-resource-picker',
  templateUrl: './resource-picker.component.html',
  styleUrls: ['./resource-picker.component.css'],
})
export class ResourcePickerComponent implements OnInit {
  selectedData: any[];
  canSave = false;
  @ViewChild('child') child;
  constructor(public dialogRef: MatDialogRef<ResourcePickerComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IResourcePickerData, private resourceService: ResourceService ) {

    this.resourceService.importResource({ type: data.type, scope: data.scope, version: data.version});

  }
  ngOnInit() {
    console.log(this.data);
  }

  select($event: string) {
    this.data.versionChange($event);
  }

  selected($event: any[]) {
    this.selectedData = $event;
  }

  submit() {
    this.dialogRef.close(this.selectedData);
  }

  setValid($event: boolean) {
    this.canSave = $event;
  }

  cancel() {
    this.dialogRef.close();
  }

  isValid() {
    return this.child && this.child.isValid();
  }
}
