import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  items: MenuItem[];

  ngOnInit() {
    this.items = [
      {
        label: 'Export Styles',
        expanded: true,
        disabled: true,
        items: [
          {
            label: 'ConformanceProfile Table Options',
            routerLink: 'conformance-profile-table-options'
          },
          {
            label: 'Segment Table Options',
            routerLink: 'segment-table-options'
          },
          {
            label: 'Data Type Table Options',
            routerLink: 'datatype-table-options'
          },
          {
            label: 'Value Set Table Options',
            routerLink: 'valueset-table-options'
          },
          {
            label: 'Composite Profile Table Options',
            routerLink: 'composite-profile-table-options'
          },
          {
            label: 'Profile Component Table Options',
            routerLink: 'profile-component-table-options'
          }
        ]
      },
      {
        label: 'Export Fonts', icon: 'fa-font',
        routerLink: 'export-fonts'
      },
      {
        label: 'Datatype Library', icon: 'fa-book',
        routerLink: 'datatype-library'
      }
    ];
  }

}
