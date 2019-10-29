import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from '../../core/models/message/message.class';
import { IStructureElementBinding } from '../../shared/models/binding.interface';
import { IConformanceStatementList } from '../../shared/models/cs-list.interface';
import { IChange } from '../../shared/models/save-change';
import { ISegment } from '../../shared/models/segment.interface';
import { ValueSetService } from '../../value-set/service/value-set.service';

@Injectable()
export class SegmentService {

  readonly URL = 'api/segments/';

  constructor(private http: HttpClient, private valueSetService: ValueSetService) { }

  getById(id: string): Observable<ISegment> {
    return this.http.get<ISegment>(this.URL + id);
  }

  getConformanceStatements(id: string, documentId: string): Observable<IConformanceStatementList> {
    return this.http.get<IConformanceStatementList>(this.URL + id + '/conformancestatement/' + documentId);
  }

  saveChanges(id: string, documentId: string, changes: IChange[]): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.URL + id, changes, {
      params: {
        dId: documentId,
      },
    });
  }

  getObx2Values(obx: ISegment, igId: string): Observable<string[]> {
    if (obx.binding != null && obx.binding.children && obx.binding.children.length) {
      const obx2Binding = obx.binding.children.find((x: IStructureElementBinding) => x.locationInfo && x.locationInfo.position === 2);
      if (obx2Binding && obx2Binding.valuesetBindings.length > 0) {
        console.log(obx2Binding.valuesetBindings);
        const vsList = obx2Binding.valuesetBindings.map((vsB) => {
          return vsB.valueSets;
        }).reduce((a, b) => {
          return a.concat(b);
        });
        console.log(vsList);
        return forkJoin(vsList.map((vs) => this.valueSetService.getById(igId, vs))).pipe(
          map((valueSets) => {
            let values = [];
            valueSets.forEach((vs) => {
              values = values.concat(vs.codes.filter((code) => code.usage !== 'E').map((code) => code.value));
            });
            return values;
          }),
        );
      }
    }
  }

  getSegmentDynamicMappingInfo(id: string, igId: string): Observable<any> {
    return this.http.get<any>(this.URL + id);
  }
}
