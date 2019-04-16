import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as __ from 'lodash';
import {Types} from '../../../../common/constants/types';
import {Columns} from '../../../../common/constants/columns';
import {NgForm} from '@angular/forms';
import {DiffableResult} from '../../../../common/delta/service/delta.service';

@Component({
  selector: 'app-datatype-delta',
  templateUrl: './datatype-delta.component.html',
  styleUrls: ['./datatype-delta.component.css']
})
export class DatatypeDeltaComponent implements OnInit {

  datatypeId: any;
  igId: any;
  data: any;
  diff: DiffableResult;

  @ViewChild('editForm')
  private editForm: NgForm;

  cols = Columns.dataTypeColumns;
  selectedColumns = Columns.dataTypeColumns;
  documentType = Types.IGDOCUMENT;

  constructor(private route: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit() {
    this.datatypeId = this.route.snapshot.params['datatypeId'];
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
