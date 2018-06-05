import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import {
  TableOptionsService
} from '../../service/configuration/table-options/table-options.service';

@Component({
  selector: 'app-conformance-profile-table-options',
  templateUrl: './conformance-profile-table-options.component.html',
  styleUrls: ['./conformance-profile-table-options.component.css']
})
export class ConformanceProfileTableOptionsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private location: Location, private tableOptionService: TableOptionsService) {
    this.changed = false;
  }

  tableOptions: Object;
  changed: boolean;

  ngOnInit() {
    this.route.data
      .subscribe(data => {
        this.tableOptions = data.tableOptions;
      });
  }

  save() {
    this.tableOptionService.saveConformanceProfileTableOptions(this.tableOptions).then(() => {
      console.log('saved successfully');
    }).catch(error => {
      console.log('unable to save table options: ' + error);
    });
  }

  setChanged() {
    this.changed = true;
    console.log("form has been changed!");
  }

  goBack(): void {
    this.location.back();
  }
}
