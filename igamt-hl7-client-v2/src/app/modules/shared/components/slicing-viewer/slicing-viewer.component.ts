import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import _ from 'lodash';
import {IDisplayElement} from '../../models/display-element.interface';
import {ISlicing} from '../../models/slicing';
import {IDisyplayMap} from '../slicing-editor/slicing-row.component';

@Component({
  selector: 'app-slicing-viewer',
  templateUrl: './slicing-viewer.component.html',
  styleUrls: ['./slicing-viewer.component.css'],
})
export class SlicingViewerComponent implements OnInit {

  @Input()
  slicing: ISlicing;
  map: IDisyplayMap = {};

  @Input()
  set options(values: IDisplayElement[]) {
    this.map = _.keyBy(values, (o) => o.id);
  }
  constructor() { }

  ngOnInit() {
  }

}
