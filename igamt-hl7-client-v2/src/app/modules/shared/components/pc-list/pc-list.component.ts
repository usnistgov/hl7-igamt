import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TreeDragDropService, TreeNode} from 'primeng/api';
import {filter, map, tap} from 'rxjs/operators';
import {ClearResource} from '../../../../root-store/resource-loader/resource-loader.actions';
import {IDisplayElement} from '../../models/display-element.interface';
import {AddProfileComponentComponent} from '../add-profile-component/add-profile-component.component';
import {ResourcePickerComponent} from '../resource-picker/resource-picker.component';
import {AddPcToList} from './add-profile-component/add-pc-to-list.component';

@Component({
  selector: 'app-pc-list',
  templateUrl: './pc-list.component.html',
  providers: [TreeDragDropService],

  styleUrls: ['./pc-list.component.css'],
})
export class PcListComponent implements OnInit {

  @Input()
  coreProfile: IDisplayElement;
  availablePcs_: IDisplayElement[];
  pcNodes_: TreeNode[] = [];

  @Output()
  append = new EventEmitter<{pcs: IDisplayElement[], index: number}>();

  @Output()
  updateChildren = new EventEmitter<{pcs: IDisplayElement[], index: number}>();
  constructor(    private dialog: MatDialog,
  ) { }

  @Input()
  set pcNodes(pcNodes: TreeNode[]) {
    this.pcNodes_ = pcNodes;
  }

  @Input()
  set availablePcs(available: IDisplayElement[]) {
    this.availablePcs_ = available;
  }
  ngOnInit() {
  }
  addPc(position: number) {
    const dialogRef = this.dialog.open(AddPcToList, {
      data: {positon: position, available: this.availablePcs_, selected: this.getSelectMap(this.pcNodes_) },
    });
    dialogRef.afterClosed().pipe(
      tap((result: IDisplayElement[]) => {
        this.addPcs(position, result);
      }),
      filter((x) => x !== undefined)).subscribe();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.pcNodes_, event.previousIndex, event.currentIndex);
  }

  private getSelectMap(pcNodes_: TreeNode[]) {
    const obj = {};
    pcNodes_.forEach((x) =>  obj[x.data.id] = true);
    return obj;
  }

  private addPcs(position: number, result: IDisplayElement[]) {
    this.append.emit({pcs: result, index: position});
  }
  // private update(position: number, result: IDisplayElement[]) {
  //   this.addAppend.emit({pcs: result, index: position});
  // }
}
