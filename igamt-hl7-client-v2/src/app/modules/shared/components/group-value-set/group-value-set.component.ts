import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IDisplayElement } from '../../models/display-element.interface';

@Component({
  selector: 'app-group-value-set',
  templateUrl: './group-value-set.component.html',
  styleUrls: ['./group-value-set.component.scss'],
})
export class GroupValueSetComponent implements OnInit {

  // Fixed headers for grouping
  default_groupNames = ['HL7', 'USER', 'External', 'Others'];
  groupNames: string[] = [];
  groupedData: { [key: string]: IDisplayElement[] } = {};

  constructor(
    public dialogRef: MatDialogRef<GroupValueSetComponent>,
    public http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: { all: any }
  ) {}

  ngOnInit(): void {
    console.log(this.groupedData);
    console.log(this.data.all.children);

    this.default_groupNames.forEach(group => this.groupedData[group] = []);

    for (const item of this.data.all.children) {
      const scope = item.domainInfo.scope;
      if (item.domainInfo.scope ==='HL7STANDARD') {
        
        this.groupedData['HL7'].push(item);

      } else if(item.domainInfo.scope ==='USER') {

        this.groupedData['USER'].push(item);

      } else {

        this.groupedData['Others'].push(item);

      }
    }

    this.groupNames = [...this.default_groupNames];
  }

  cancel(): void {
    this.dialogRef.close();
  }

  done(): void {
    this.dialogRef.close(this.groupedData);
  }

  drop(event: CdkDragDrop<IDisplayElement[]>, group: string): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.groupedData[group], event.previousIndex, event.currentIndex);
    } else {
      const prevGroup = this.groupNames.find(g => this.groupedData[g] === event.previousContainer.data);
      if (prevGroup) {
        transferArrayItem(
          this.groupedData[prevGroup],
          this.groupedData[group],
          event.previousIndex,
          event.currentIndex
        );
      }
    }
  }

  deleteGroup(group: string): void {
    this.groupedData[group] = [];
  }
  getConnectedDropLists(currentGroup: string): string[] {
    return this.groupNames.filter(group => group !== currentGroup);
  }
}
