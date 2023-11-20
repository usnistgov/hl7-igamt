import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { sortAscendingPriority } from '@angular/flex-layout';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Type } from '../constants/type.enum';
import { IConformanceProfile } from '../models/conformance-profile.interface';
import { IResource } from '../models/resource.interface';
import { ISegment } from '../models/segment.interface';
import { ISlicing } from '../models/slicing';
import { ElementNamingService, IPathInfo } from './element-naming.service';

@Injectable({
  providedIn: 'root',
})
export class SlicingService {

  constructor(private http: HttpClient, private store: Store<any>, private elementNamingService: ElementNamingService) { }

  getResoureSlicing = (type: Type, id: string): Observable<ISlicing[]> => {
    switch (type) {
      case Type.CONFORMANCEPROFILE:
        return this.getOrdered(this.http.get<IConformanceProfile>('api/conformanceprofiles/' + id));
      case Type.SEGMENT:
        return this.getOrdered(this.http.get<ISegment>('api/segments/' + id));
      default: return null;
    }
    return of([]);
  }
  getOrdered(obs: Observable<IResource>) {
    return obs.pipe(map((x) => x.slicings ? this.order(x.slicings) : []));
  }

  order(slicings: ISlicing[]) {
    slicings.sort((a, b) => {
      return this.comparePositionalId(a.path, b.path);
    });
    return slicings;
  }

  comparePositionalId(p1: string, p2: string): number {
    const p1List = p1.split('-').map(Number);
    const p2List = p2.split('-').map(Number);
    const size = Math.min(p1List.length, p2.length);
    for (let i = 0; i < size; i++) {
      if (p1List[i] > p2List[i]) { return 1; }
      if (p1List[i] < p2List[i]) { return -1; }
    }
    if (p1List.length > p2List.length) { return 1; }
    if (p1List.length < p2List.length) { return -1; }
    return 0;
  }
}
