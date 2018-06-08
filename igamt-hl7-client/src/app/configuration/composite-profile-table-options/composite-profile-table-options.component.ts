import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TableOptionsService} from '../../service/configuration/table-options/table-options.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-composite-profile-table-options',
  templateUrl: './composite-profile-table-options.component.html',
  styleUrls: ['./composite-profile-table-options.component.css']
})
export class CompositeProfileTableOptionsComponent implements OnInit {

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
    this.tableOptionService.saveCompositeProfileTableOptions(this.tableOptions).then(() => {
      console.log('saved successfully');
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
