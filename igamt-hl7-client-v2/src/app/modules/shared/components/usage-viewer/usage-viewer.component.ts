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
  allTypes: SelectItem[] = [
    { label: 'Data Type', value: Type.DATATYPE },
    { label: 'Segments', value: Type.SEGMENT },
    { label: 'Conformance Profile', value: Type.CONFORMANCEPROFILE },
    { label: 'Profile Component', value: Type.PROFILECOMPONENT },
    { label: 'Composite Profile', value: Type.COMPOSITEPROFILE },
    { label: 'Co-Constraint', value: Type.COCONSTRAINTGROUP },
  ];
  types: SelectItem[];
  @Input()
  set elementType($event: Type) {
    switch ($event) {
      case Type.DATATYPE:
        this.types = [... this.allTypes.filter((x) => x.value !== Type.CONFORMANCEPROFILE &&  x.value !== Type.COMPOSITEPROFILE )];
        break;
      case Type.COCONSTRAINTGROUP:
        this.types = [... this.allTypes.filter((x) => x.value !== Type.DATATYPE && x.value !== Type.SEGMENT )];
        break;
      case Type.SEGMENT:
        this.types = [... this.allTypes.filter((x) => x.value !== Type.DATATYPE  )];
        break;
      case Type.VALUESET:
        this.types = [... this.allTypes ];
        break;
      case Type.CONFORMANCEPROFILE:
        this.types = [... this.allTypes.filter((x) =>  x.value === Type.COMPOSITEPROFILE )];
        break;
      case Type.PROFILECOMPONENT:
        this.types = [... this.allTypes.filter((x) =>  x.value === Type.COMPOSITEPROFILE )];
        break;
      default:
        this.types = [... this.allTypes ];
    }
  }

  usages: SelectItem[];

  refsDisplay: IUsages[] = [];

  constructor() { }

  ngOnInit() {

    this.usages = [
        { label: 'R', value:  'R'  },
        { label: 'C', value:  'C'  },
        { label: 'RE', value: 'RE'},
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
