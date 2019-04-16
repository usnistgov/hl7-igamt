import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as __ from 'lodash';
import {Types} from '../../../../common/constants/types';
import {Columns} from '../../../../common/constants/columns';
import {NgForm} from '@angular/forms';
import {DiffableResult} from '../../../../common/delta/service/delta.service';

@Component({
  selector: 'app-conformanceprofile-delta',
  templateUrl: './conformanceprofile-delta.component.html',
  styleUrls: ['./conformanceprofile-delta.component.css']
})
export class ConformanceprofileDeltaComponent implements OnInit {

  conformanceProfileId: any;
  igId: any;
  data: any;
  diff: DiffableResult;

  @ViewChild('editForm')
  private editForm: NgForm;

  cols = Columns.messageColumns;
  selectedColumns = Columns.messageColumns;
  documentType = Types.IGDOCUMENT;

  constructor(private route: ActivatedRoute,
              private router: Router) {

  }

  accept(type, allow) {
    return type && (allow.includes(type.current) || allow.includes(type.previous));
  }

  ngOnInit() {
    this.conformanceProfileId = this.route.snapshot.params['conformanceprofileId'];
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
