import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TableOptionsService} from '../../service/configuration/table-options/table-options.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-profile-component-table-options',
  templateUrl: './profile-component-table-options.component.html',
  styleUrls: ['./profile-component-table-options.component.css']
})
export class ProfileComponentTableOptionsComponent implements OnInit {

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
    this.tableOptionService.saveProfileComponentTableOptions(this.tableOptions).then(() => {
      console.log('saved successfully');
      this.changed = false;
    }).catch(error => {
      console.log('unable to save table options: ' + error);
    });
  }

  setChanged() {
    this.changed = true;
  }

  goBack(): void {
    this.location.back();
  }

}
