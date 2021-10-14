import {Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {Scope} from '../../constants/scope.enum';
import {Type} from '../../constants/type.enum';
import {IResourcePickerData} from '../../models/resource-picker-data.interface';
import {IResource} from '../../models/resource.interface';
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
  data$: Observable<IResource[]> = of([]);
  constructor(public dialogRef: MatDialogRef<ResourcePickerComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IResourcePickerData, private resourceService: ResourceService ) {

    this.data$ = this.resourceService.importResource({ type: data.type, scope: data.scope, version: data.version, compatibility: data.compatibility}).pipe(map((x) =>  x.data));

  }
  ngOnInit() {
  }

  select($event: string) {
    this.data$ = this.resourceService.importResource({ type: this.data.type, scope: this.data.scope, version: $event, compatibility: this.data.compatibility}).pipe(map((x) =>  x.data));
  }

  selected($event: any[]) {
    this.selectedData = $event;
  }

  submit() {
    this.dialogRef.close(this.selectedData);
  }
  cancel() {
    this.dialogRef.close();
  }

  isValid() {
    return this.child && this.child.isValid();
  }

  update(version: string, scope: Scope) {
    this.data$ = this.resourceService.importResource({ type: this.data.type, scope, version, compatibility: this.data.compatibility}).pipe(map((x) =>  x.data));
  }
}
