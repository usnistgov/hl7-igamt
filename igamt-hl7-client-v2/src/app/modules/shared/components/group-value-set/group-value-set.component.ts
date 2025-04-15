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

    editingGroup: string | null = null;
editedGroupName: string = '';


  // Fixed headers for grouping
  default_groupNames = ['HL7', 'USER', 'External', 'Others'];

  custom = false;

  newGroupName: string = '';

  groupNames: string[] = [];
  groupedData: { [key: string]: IDisplayElement[] } = {};


  

  constructor(
    public dialogRef: MatDialogRef<GroupValueSetComponent>,
    public http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: { all: any, groups: any[] }
  ) {}

  ngOnInit(): void {

    if(this.data.groups.length) {
        this.custom = true;

    }
    else {

        this.buildDefaultGroupedData();
    }

  }


  buildDefaultGroupedData(){

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
    console.log(this.groupedData);
    let groupedMap = {};

    for (const group of Object.keys(this.groupedData)) {

      let ids = this.groupedData[group].map(item => item.id);

      //groupedMap.set(group, ids);
      groupedMap[group] = ids;

    }
    console.log(groupedMap);

   this.dialogRef.close(groupedMap);
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

  customize(){
    this.custom = true;

  }

  addGroup() {
    if (!this.groupNames.includes(this.newGroupName)) {
      this.groupNames.push(this.newGroupName);
      this.groupedData[this.newGroupName] = [];
      this.newGroupName = '';
    }
  }


  startEditingGroup(group: string): void {
    this.editingGroup = group;
    this.editedGroupName = group;
  }
  
  cancelEditing(): void {
    this.editingGroup = null;
    this.editedGroupName = '';
  }
  
  renameGroup(oldName: string): void {
    const newName = this.editedGroupName.trim();
  
    if (!newName || newName === oldName || this.groupNames.includes(newName)) {
      this.cancelEditing();
      return;
    }
  
    const index = this.groupNames.indexOf(oldName);
    if (index !== -1) {
      this.groupNames[index] = newName;
    }
  
    this.groupedData[newName] = this.groupedData[oldName];
    delete this.groupedData[oldName];
  
    this.cancelEditing();
  }


}
