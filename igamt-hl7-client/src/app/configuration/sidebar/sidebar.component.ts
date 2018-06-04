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
        icon: 'fa-check',
        expanded: true,
        items: [

            {
              label: 'ConformanceProfile Table Options',
              routerLink: ['conformance-profile-table-options', {outlets: {'content': ['conformance-profile-table-options']}}]
            },
            {
              label: 'Segment Table Options'
            },
            {
              label: 'Data Type Table Options'
            },
            {
              label: 'Value Set Table Options'
            },
            {
              label: 'Composite Profile Table Options'
            },
            {
              label: 'Profile Component Table Options'
            }

        ]
      },
      {
        label: 'Export Fonts', icon: 'fa-soccer-ball-o',
        routerLink: 'export-fonts'
      },
      {
        label: 'Datatype Library', icon: 'fa-soccer-ball-o'
      }
    ];
  }

}
