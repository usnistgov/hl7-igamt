import {Component, Input, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {SelectItem} from 'primeng/api';
import {Type} from '../../constants/type.enum';
import {IUsages} from '../../models/cross-reference';
import {IDisplayElement} from '../../models/display-element.interface';

@Component({
  selector: 'app-usage-viewer',
  templateUrl: './usage-viewer.component.html',
  styleUrls: ['./usage-viewer.component.css'],
})
export class UsageViewerComponent implements OnInit {

  @Input()
  refs: IUsages[] = [];
  @Input()
  igId: string;
  @Input()
  documentType: Type;
  types: SelectItem[];
  usages: SelectItem[];

  refsDisplay: IUsages[] = [];

  constructor() { }

  ngOnInit() {
    this.types = [
      { label: 'Data Type', value: Type.DATATYPE },
      { label: 'Segments', value: Type.SEGMENT },
      { label: 'Conformance Profile', value: Type.CONFORMANCEPROFILE },
      { label: 'Co-Constraints Group', value: Type.COCONSTRAINTGROUP },

    ];
    this.usages = [
        { label: 'R', value:  'R'  },
        { label: 'C', value:  'C'  },
        { label: 'RE', value:  'RE'  },
        { label: 'X', value:  'X'  },
        { label: 'O', value:  'O'  },
    ];
    this.refsDisplay =  _.cloneDeep(this.refs);
  }

  filterByType(value: Type[]) {
    this.refsDisplay = _.cloneDeep(this.refs).filter( (obj: IUsages) => {
     return  value.indexOf(obj.element.type) > -1;
    });
  }

  filterByUsages(value: any[]) {
    this.refsDisplay = _.cloneDeep(this.refs).filter( (obj: IUsages) => {
      return  value.indexOf(obj.usage) > -1;
    });
  }
}
