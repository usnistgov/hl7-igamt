import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Type } from '../../constants/type.enum';
import { IConformanceStatement } from '../../models/cs.interface';
import { IDisplayElement } from '../../models/display-element.interface';
import { AResourceRepositoryService } from '../../services/resource-repository.service';

@Component({
  selector: 'app-cs-list',
  templateUrl: './cs-list.component.html',
  styleUrls: ['./cs-list.component.scss'],
})
export class CsListComponent implements OnInit {

  @Input()
  list: IConformanceStatement[];
  listDisplay: IConformanceStatement[];
  types = [
    { label: 'Data Type', value: Type.DATATYPE },
    { label: 'Segments', value: Type.SEGMENT },
    { label: 'Conformance Profile', value: Type.CONFORMANCEPROFILE },
  ];
  @Input()
  repository: AResourceRepositoryService;
  @Input()
  documentId: string;

  constructor() { }

  getDisplay(type: Type, id: string): Observable<IDisplayElement> {
    return this.repository.getResourceDisplay(type, id);
  }

  filterByType(value: Type[]) {
    this.listDisplay = _.cloneDeep(this.list).filter((obj: IConformanceStatement) => {
      return value.indexOf(obj.level) > -1;
    });
  }

  ngOnInit() {
    this.listDisplay = _.cloneDeep(this.list);
  }

}
