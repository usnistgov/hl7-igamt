import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'angular-tree-component';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { Scope } from 'src/app/modules/shared/constants/scope.enum';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {

  nodes: Array<Partial<IDisplayElement>>;

  constructor() {
    this.nodes = [{
      type: Type.CONFORMANCEPROFILEREGISTRY,
      children: [{
        id: '1',
        fixedName: 'VXU_Q11',
        variableName: undefined,
        description: '',
        type: Type.CONFORMANCEPROFILE,
        leaf: true,
        domainInfo: {
          scope: Scope.USERCUSTOM,
          version: '2.5',
        },
        differential: false,
        isExpanded: false,
      }],
    }, {
      type: Type.SEGMENTREGISTRY,
      children: [{
        id: '1',
        fixedName: 'OBX',
        variableName: 'A',
        description: '',
        type: Type.SEGMENT,
        domainInfo: {
          scope: Scope.USERCUSTOM,
          version: '2.5',
        },
        leaf: true,
        differential: false,
        isExpanded: false,
      }],
    }];
  }

  ngOnInit() {
  }

}
