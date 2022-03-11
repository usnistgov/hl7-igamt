import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { selectLoadedDocumentInfo } from 'src/app/root-store/dam-igamt/igamt.selectors';
import { SetValue } from '../../dam-framework/store/data/dam.actions';
import { selectValue } from '../../dam-framework/store/data/dam.selectors';
import { Scope } from '../../shared/constants/scope.enum';
import { Type } from '../../shared/constants/type.enum';
import { Usage } from '../../shared/constants/usage.enum';
import { IDisplayElement } from '../../shared/models/display-element.interface';

export const IG_TOC_FILTER_STATE = 'igTocFilter';
export const selectIgTocFilter = selectValue<IIgTocFilter>(IG_TOC_FILTER_STATE);

export interface IIgTocFilterConfiguration {
  usedInConformanceProfiles: {
    active: boolean;
    conformanceProfiles: string[];
    allow: boolean;
    usages: Usage[];
  };
  hideNarratives: boolean;
  filterByType: {
    active: boolean;
    allow: boolean;
    types: Type[];
  };
  filterByScope: {
    active: boolean;
    allow: boolean;
    scopes: Scope[];
  };
}

export interface IResourceFilter {
  conformanceProfiles: string[];
  segments: string[];
  datatypes: string[];
  valueSets: string[];
  coConstraintGroup: string[];
}

export interface IIgTocFilter extends IIgTocFilterConfiguration {
  active: boolean;
  resources: IResourceFilter;
}

@Injectable({
  providedIn: 'root',
})
export class IgTocFilterService {

  readonly typeMap: Record<string, Type[]> = {
    [Type.PROFILECOMPONENTREGISTRY]: [
      Type.PROFILECOMPONENTREGISTRY,
      Type.PROFILECOMPONENT,
      Type.MESSAGECONTEXT,
      Type.SEGMENTCONTEXT,
    ],
    [Type.COMPOSITEPROFILEREGISTRY]: [
      Type.COMPOSITEPROFILEREGISTRY,
      Type.COMPOSITEPROFILE,
    ],
    [Type.CONFORMANCEPROFILEREGISTRY]: [
      Type.CONFORMANCEPROFILEREGISTRY,
      Type.CONFORMANCEPROFILE,
    ],
    [Type.SEGMENTREGISTRY]: [
      Type.SEGMENTREGISTRY,
      Type.SEGMENT,
    ],
    [Type.DATATYPEREGISTRY]: [
      Type.DATATYPEREGISTRY,
      Type.DATATYPE,
    ],
    [Type.VALUESETREGISTRY]: [
      Type.VALUESETREGISTRY,
      Type.VALUESET,
    ],
    [Type.COCONSTRAINTGROUPREGISTRY]: [
      Type.COCONSTRAINTGROUPREGISTRY,
      Type.COCONSTRAINTGROUP,
    ],
  };
  byType: Type[] = [];

  constructor(private store: Store<any>, private http: HttpClient) {
    for (const k of Object.keys(this.typeMap)) {
      this.byType = [
        ...this.byType,
        ...this.typeMap[k],
      ];
    }
  }

  setFilter(config: IIgTocFilterConfiguration) {
    this.getFilter(config).pipe(
      take(1),
      map((filter) => {
        this.store.dispatch(new SetValue({
          [IG_TOC_FILTER_STATE]: { ...filter },
        }));
      }),
    ).subscribe();
  }

  mapTypeAndContent(filter: Type[]): Type[] {
    let types = [];
    for (const type of filter) {
      if (this.typeMap[type]) {
        types = [
          ...types,
          ...this.typeMap[type],
        ];
      }
    }
    return types;
  }

  getResourceIds(config: IIgTocFilterConfiguration): Observable<IResourceFilter> {
    if (config.usedInConformanceProfiles.active) {
      return this.store.select(selectLoadedDocumentInfo).pipe(
        take(1),
        mergeMap((x) => {
          return this.http.post<IResourceFilter>('/api/igdocuments/' + x.documentId + '/filter/', this.getFilterInput(config));
        }));
    } else {
      return of({
        conformanceProfiles: [],
        segments: [],
        datatypes: [],
        valueSets: [],
        coConstraintGroup: [],
      });
    }
  }
  getFilterInput(config: IIgTocFilterConfiguration): any {
    return {
      conformanceProfiles: config.usedInConformanceProfiles.conformanceProfiles,
      usageFilter: {
        values: config.usedInConformanceProfiles.usages,
        allow: true,
      },
    };
  }

  isActive(config: IIgTocFilterConfiguration): boolean {
    if (config) {
      const usedInConformanceProfile = config.usedInConformanceProfiles && config.usedInConformanceProfiles.active;
      const hideNarratives = config.hideNarratives;
      const filterByType = config.filterByType && config.filterByType.active;
      const filterByScopes = config.filterByScope && config.filterByScope.active;
      return usedInConformanceProfile || hideNarratives || filterByType || filterByScopes;
    } else {
      return false;
    }
  }

  getFilter(config: IIgTocFilterConfiguration): Observable<IIgTocFilter> {
    return this.getResourceIds(config).pipe(
      take(1),
      map((resources) => {
        return {
          active: this.isActive(config),
          resources: {
            conformanceProfiles: [
              ...resources.conformanceProfiles,
            ],
            segments: [
              ...resources.segments,
            ],
            datatypes: [
              ...resources.datatypes,
            ],
            valueSets: [
              ...resources.valueSets,
            ],
            coConstraintGroup: [
              ...resources.coConstraintGroup,
            ],
          },
          usedInConformanceProfiles: config.usedInConformanceProfiles,
          hideNarratives: config.hideNarratives,
          filterByType: {
            ...config.filterByType,
            types: [
              ...this.mapTypeAndContent(config.filterByType.types || []),
            ],
          },
          filterByScope: {
            ...config.filterByScope,
          },
        };
      }),
    );
  }

  isFiltered(display: IDisplayElement, filter: IIgTocFilter): boolean {
    return this.filterNarrative(display, filter)
      || this.filterType(display, filter)
      || this.filterScope(display, filter)
      || this.filterResource(display, filter);
  }

  filterNarrative(display: IDisplayElement, filter: IIgTocFilter) {
    return display.type === Type.TEXT && filter.hideNarratives;
  }

  filterScope(display: IDisplayElement, filter: IIgTocFilter): boolean {
    if (filter.filterByScope.active && [Type.SEGMENT, Type.DATATYPE, Type.VALUESET].includes(display.type)) {
      return this.pass(
        (display.domainInfo &&
          filter.filterByScope.scopes.includes(display.domainInfo.scope)) ||
        filter.filterByScope.scopes.length === 0,
        filter.filterByScope.allow,
      );
    } else {
      return false;
    }
  }

  filterType(display: IDisplayElement, filter: IIgTocFilter): boolean {
    if (filter.filterByType.active && this.byType.includes(display.type)) {
      return this.pass(
        display.type &&
        filter.filterByType.types.includes(display.type) ||
        filter.filterByType.types.length === 0,
        filter.filterByType.allow,
      );
    } else {
      return false;
    }
  }

  filterResource(display: IDisplayElement, filter: IIgTocFilter): boolean {
    if (filter.usedInConformanceProfiles.active && [
      Type.CONFORMANCEPROFILE,
      Type.SEGMENT,
      Type.DATATYPE,
      Type.VALUESET,
      Type.COCONSTRAINTGROUP,
    ].includes(display.type)) {
      let used = false;
      switch (display.type) {
        case Type.CONFORMANCEPROFILE:
          used = filter.resources.conformanceProfiles.includes(display.id);
          break;
        case Type.SEGMENT:
          used = filter.resources.segments.includes(display.id);
          break;
        case Type.DATATYPE:
          used = filter.resources.datatypes.includes(display.id);
          break;
        case Type.VALUESET:
          used = filter.resources.valueSets.includes(display.id);
          break;
        case Type.COCONSTRAINTGROUP:
          used = filter.resources.coConstraintGroup.includes(display.id);
          break;
      }
      return this.pass(
        used || filter.usedInConformanceProfiles.conformanceProfiles.length === 0,
        filter.usedInConformanceProfiles.allow,
      );
    } else {
      return false;
    }
  }

  private pass(value: boolean, allow: boolean): boolean {
    if (allow) {
      return !value;
    } else {
      return value;
    }
  }

}
