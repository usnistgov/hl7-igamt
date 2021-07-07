import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from '../../dam-framework/models/messages/message.class';
import { IDocumentRef } from '../../shared/models/abstract-domain.interface';
import { IStructureElementBinding } from '../../shared/models/binding.interface';
import { IConformanceStatementList } from '../../shared/models/cs-list.interface';
import {IDisplayElement} from '../../shared/models/display-element.interface';
import { IChange } from '../../shared/models/save-change';
import { ISegment } from '../../shared/models/segment.interface';
import {DisplayService} from '../../shared/services/display.service';
import { ValueSetService } from '../../value-set/service/value-set.service';

@Injectable(
  {  providedIn: 'root',
  },
)
export class SegmentService {

  readonly URL = 'api/segments/';

  constructor(private http: HttpClient, private valueSetService: ValueSetService, private  displayService: DisplayService) { }

  getById(id: string): Observable<ISegment> {
    return this.http.get<ISegment>(this.URL + id);
  }

  getConformanceStatements(id: string, documentRef: IDocumentRef): Observable<IConformanceStatementList> {
    return this.http.get<IConformanceStatementList>(this.URL + id + '/conformancestatement/' + documentRef.documentId);
  }

  saveChanges(id: string, documentRef: IDocumentRef, changes: IChange[]): Observable<Message<string>> {
    return this.http.post<Message<string>>(this.URL + id, changes, {
      params: {
        dId: documentRef.documentId,
      },
    });
  }
  getValueSetBindingByLocation(obj: ISegment, location: number): string[] {
    if (obj.binding != null && obj.binding.children && obj.binding.children.length) {
      const obx2Binding = obj.binding.children.find((x: IStructureElementBinding) => x.locationInfo && x.locationInfo.position === 2);
      if (obx2Binding && obx2Binding.valuesetBindings.length > 0) {
        return obx2Binding.valuesetBindings.map((vsB) => {
          return vsB.valueSets;
        }).reduce((a, b) => {
          return a.concat(b);
        });
      }
    } else { return []; }
  }

  getObx2Values(obx: ISegment, documentRef: IDocumentRef): Observable<string[]> {
        return forkJoin(this.getValueSetBindingByLocation(obx, 2).map((vs) => this.valueSetService.getById(documentRef, vs))).pipe(
          map((valueSets) => {
            let values = [];
            valueSets.forEach((vs) => {
              values = values.concat(vs.codes.filter((code) => code.usage !== 'E').map((code) => code.value));
            });
            return values;
          }),
        );
  }

  getObx2DynamicMappingInfo(obx: ISegment, documentRef: IDocumentRef): Observable<{display: IDisplayElement, values: string[]}> {
     const availableValueSets = this.getValueSetBindingByLocation(obx, 2);
     if (availableValueSets && availableValueSets.length) {
       return this.valueSetService.getById(documentRef, availableValueSets[0]).pipe(map((vs) => {
         let values = [];
         values = values.concat(vs.codes.filter((code) => code.usage !== 'E').map((code) => code.value));
         return {display: this.displayService.getDisplay(vs), values};
       }));
     }
  }
  getSegmentDynamicMappingInfo(id: string, igId: string): Observable<any> {
    return this.http.get<any>(this.URL + id);
  }
}
