import { Component, OnInit } from '@angular/core';
import { PPColumn } from '../pp-column.component';
import { PropertyType } from 'src/app/modules/shared/models/save-change';
import { IItemProperty } from 'src/app/modules/shared/models/profile.component';
import { MatDialog } from '@angular/material';
import { IProfileComponentItemLocation } from 'src/app/modules/profile-component/services/profile-component.service';


@Component({
  selector: 'app-pp-name',
  templateUrl: './pp-name.component.html',
  styleUrls: ['./pp-name.component.scss'],
})
export class PpNameComponent extends PPColumn<IProfileComponentItemLocation> implements OnInit {

  constructor(
    dialog: MatDialog,
  ) {
    super(
      [PropertyType.NAME],
      dialog,
    )
  }

  apply(values: Record<PropertyType, IItemProperty>) {
  }

  ngOnInit() {
  }

}
