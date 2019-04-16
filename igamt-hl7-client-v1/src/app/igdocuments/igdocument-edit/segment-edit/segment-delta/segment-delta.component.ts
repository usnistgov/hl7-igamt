import {Component, OnInit, ViewChild} from '@angular/core';
import {DiffableResult} from '../../../../common/delta/service/delta.service';
import {GeneralConfigurationService} from '../../../../service/general-configuration/general-configuration.service';
import {Columns} from '../../../../common/constants/columns';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import * as __ from 'lodash';
import {Types} from '../../../../common/constants/types';

@Component({
  selector: 'app-segment-delta',
  templateUrl: './segment-delta.component.html',
  styleUrls: ['./segment-delta.component.css']
})
export class SegmentDeltaComponent implements OnInit {

  segmentId: any;
  igId: any;
  data: any;
  diff: DiffableResult;

  @ViewChild('editForm')
  private editForm: NgForm;

  cols = Columns.segmentColumns;
  selectedColumns = Columns.segmentColumns;
  documentType = Types.IGDOCUMENT;

  constructor(private route: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit() {
    this.segmentId = this.route.snapshot.params['segmentId'];
    this.igId = this.router.url.split('/')[2];

    this.route.data.subscribe(data => {
      this.data = data['delta'];
    });
  }

  hasChanged() {
    return false;
  }

  refreshTree() {
    this.data.structure = [...this.data.structure];
  }

  reorderCols() {
    this.selectedColumns = __.sortBy(this.selectedColumns, ['position']);
  }
}
