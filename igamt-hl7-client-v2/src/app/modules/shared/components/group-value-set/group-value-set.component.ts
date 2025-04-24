import { SourceType } from './../../models/adding-info';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IDisplayElement } from '../../models/display-element.interface';
import { ConfirmDialogComponent } from 'src/app/modules/dam-framework/components/fragments/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-group-value-set',
  templateUrl: './group-value-set.component.html',
  styleUrls: ['./group-value-set.component.scss'],
})
export class GroupValueSetComponent implements OnInit {

    editingGroup: string | null = null;
    editedGroupName: string = '';
    valueSetMap: { [key: string]: IDisplayElement } = {};

    groupDropListId = 'group-drop-list';


    valueSetTypes = [
        { label: 'HL7STANDARD', value: 'HL7STANDARD' },
        { label: 'USER', value: 'USER' },
        { label: 'EXTERNAL', value: 'EXTERNAL' }
      ];


      typeToGroupMap: { [type: string]: string } = {
        HL7STANDARD: '',
        USER: '',
        EXTERNAL: ''
      };

    groupDropdownOptions: { label: string; value: string }[] = [];


  // Fixed headers for grouping
  default_groupNames = [];

  custom = false;

  newGroupName: string = '';

  groupNames: string[] = [];
  groupedData: { [key: string]: IDisplayElement[] } = {};



  rules = {
    hl7Group: 'HL7_Base',
    externalGroup: 'External',
    userGroup: 'HL7_Profile',
    unassignedGroup: 'Others'
  };
  


  ruleOptions = [
    { label: 'HL7STANDARD (scope)', value: 'HL7STANDARD' },
    { label: 'EXTERNAL', value: 'EXTERNAL' },
    { label: 'EXTERNAL_TRACKED', value: 'EXTERNAL_TRACKED' },
    { label: 'USER', value: 'USER' },
    { label: 'USER_TRACKED', value: 'USER_TRACKED' }
  ];

  groupRules: { [group: string]: string[] } = {};

  previousGroupedData: { [key: string]: string[] } = {};


  

  constructor(
    public dialogRef: MatDialogRef<GroupValueSetComponent>,
    private dialog: MatDialog,
    
    public http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: { valueSets: any[], groupedData: any }
  ) {}

  ngOnInit(): void {



    for (const vs of this.data.valueSets) {
        this.valueSetMap[vs.id] = vs;
    }

    
    if(this.data.groupedData &&  this.data.groupedData.custom) {

       this.custom = true;
       this.buildFromExisting(this.data.groupedData);
       this.typeToGroupMap = this.data.groupedData.defaultMap;

    } else {

        this.buildDefaultGroupedData();
    }

    this.groupDropdownOptions = this.groupNames.map(g => ({ label: g, value: g }));

  }


  dropGroup(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.groupNames, event.previousIndex, event.currentIndex);
  
    const newGroupedData: { [key: string]: any[] } = {};
    for (const group of this.groupNames) {
      newGroupedData[group] = this.groupedData[group];
    }
    this.groupedData = newGroupedData;
  }

  buildDefaultGroupedData(){
   this.default_groupNames =  ['HL7_Base', 'HL7_Profile', 'External', 'Others'];

    this.default_groupNames.forEach(group => this.groupedData[group] = []);

    for (const item of this.data.valueSets) {
      const scope = item.domainInfo.scope;
      const sourceType = item.sourceType;
      console.log(sourceType);

      
      console.log(item);
      if(item.sourceType !== SourceType.INTERNAL && item.sourceType !==SourceType.INTERNAL_TRACKED){
        this.groupedData['External'].push(item);

      }
      else if (item.domainInfo.scope ==='HL7STANDARD') {
        
        this.groupedData['HL7_Base'].push(item);

      } else if(item.domainInfo.scope ==='USER') {

        this.groupedData['HL7_Profile'].push(item);

      } else {

        this.groupedData['Others'].push(item);

      }
    }
    
    this.groupNames = [...this.default_groupNames];

  }


  buildFromExisting(groupedData){
    console.log("CALLED EXIST");
    this.groupNames =  groupedData.groupNames;
    this.groupNames = [... groupedData.groupNames];

    
    this.groupNames.forEach(group => {

        this.groupedData[group] = [];
        
        for(const vsId of groupedData.groupedData[group]) { 
            this.groupedData[group].push(this.valueSetMap[vsId]);
        }

    }
        
    
    
    );

    

    for (const item of this.data.valueSets) {
      const scope = item.domainInfo.scope;
      
      if (item.domainInfo.scope ==='HL7STANDARD') {
        
        this.groupedData['HL7'].push(item);

      } else if(item.domainInfo.scope ==='USER') {

        this.groupedData['USER'].push(item);

      } else {

        this.groupedData['Others'].push(item);

      }
    }
    

  }


  cancel(): void {
    this.dialogRef.close();
  }

  done(): void {
    let groupedMap = {};

    for (const group of Object.keys(this.groupedData)) {

      let ids = this.groupedData[group].map(item => item.id);

      groupedMap[group] = ids;

    }

   this.dialogRef.close({groupedData: groupedMap, groupNames: this.groupNames, custom: this.custom, defaultMap: this.typeToGroupMap});

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
  


  getConnectedDropLists(currentGroup: string): string[] {
    return this.groupNames.filter(group => group !== currentGroup);
  }

  customize(){
    this.custom = true;

    this.typeToGroupMap['HL7STANDARD'] = 'HL7_Base';
    this.typeToGroupMap['USER'] = 'HL7_Profile';
    

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

  isNotDefault(group: string) {

    if(group.toLocaleLowerCase() ==='Others'.toLocaleLowerCase()){
      return false;
    }
    return true;
  
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





  deleteGroup(group: string): void {
    if (!this.isNotDefault(group)) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        question: `Are you sure you want to delete the group "${group}"?`,
        action: 'Delete Group',
      },
    });

    dialogRef.afterClosed().subscribe((answer) => {
      if (answer) {
        if (!this.groupedData['Others']) {
          this.groupNames.push('Others');
          this.groupedData['Others'] = [];
        }
        
        if (this.groupedData[group] && this.groupedData[group].length > 0) {
          this.groupedData['Others'] = [...this.groupedData['Others'], ...this.groupedData[group]];
        }
        
        const index = this.groupNames.indexOf(group);
        if (index !== -1) {
          this.groupNames.splice(index, 1);
        }
        
        delete this.groupedData[group];
      }
    });
    }

  



  redistribute(): void {
    this.previousGroupedData = JSON.parse(JSON.stringify(this.groupedData));
  
    for (const group of this.groupNames) {
      this.groupedData[group] = [];
    }
  
    const assigned = new Set<string>();
  
    for (const vs of this.data.valueSets) {
      const id = vs.id;
      if (!id) continue;
  
      let type: string | null = null;
  
      if (vs.domainInfo && vs.domainInfo.scope === 'HL7STANDARD') {
        type = 'HL7STANDARD';
      } else if (vs.domainInfo && vs.domainInfo.scope === 'USER') {
        type = 'USER';
      } else if (vs.sourceType === 'EXTERNAL' || vs.sourceType === 'EXTERNAL_TRACKED') {
        type = 'EXTERNAL';
      }
  
      const targetGroup = type ? this.typeToGroupMap[type] : null;
  
      if (targetGroup && this.groupedData[targetGroup]) {
        this.groupedData[targetGroup].push(this.valueSetMap[id]);
        assigned.add(id);
      }
    }
  
    const unassignedGroup = this.groupNames.includes('Others') ? 'Others' : null;
    if (unassignedGroup) {
      for (const vs of this.data.valueSets) {
        const id = vs.id;
        if (id && !assigned.has(id)) {
          this.groupedData[unassignedGroup].push(this.valueSetMap[id]);
        }
      }
    }
  }
  
  
  
  






  
  restore(): void {
    this.groupedData = JSON.parse(JSON.stringify(this.previousGroupedData));
  }


  

}
