import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { IUsageOption } from '../../../shared/components/hl7-v2-tree/columns/usage/usage.component';
import { Scope } from '../../../shared/constants/scope.enum';
import { Type } from '../../../shared/constants/type.enum';
import { Usage } from '../../../shared/constants/usage.enum';
import { Hl7Config } from '../../../shared/models/config.class';
import { IDisplayElement } from '../../../shared/models/display-element.interface';

export interface ITocFilter {
  usedInConformanceProfiles: {
    active: boolean;
    conformanceProfiles: string[];
    exclude: boolean;
    usages: Usage[];
  };
  hideNarratives: boolean;
  filterByType: {
    active: boolean;
    allow: boolean;
    types: Type[];
  };
  filterByDerived: {
    active: boolean;
    allow: boolean;
    value: boolean;
  };
  filterByScope: {
    active: boolean;
    allow: boolean;
    scopes: Scope[];
  };
}

@Component({
  selector: 'app-ig-toc-filter',
  templateUrl: './ig-toc-filter.component.html',
  styleUrls: ['./ig-toc-filter.component.scss'],
})
export class IgTocFilterComponent implements OnInit {

  @Input()
  set conformanceProfiles(items: IDisplayElement[]) {
    this.conformanceProfilesMap = {};
    this.conformanceProfileOptions = [];
    for (const item of items) {
      this.conformanceProfilesMap[item.id] = item;
      this.conformanceProfileOptions.push({
        label: item.id,
        value: item.id,
      });
    }
    console.log(this.conformanceProfilesMap);
  }
  @Input()
  activeFilter: ITocFilter;
  @Output()
  update: EventEmitter<ITocFilter>;
  @Input()
  set config(c: Hl7Config) {
    this.usages = Hl7Config.getUsageOptions(c.usages, true, true);
  }
  usages: IUsageOption[];
  conformanceProfilesMap: Record<string, IDisplayElement>;
  conformanceProfileOptions: SelectItem[];
  active: boolean;
  scopeOptions: SelectItem[];
  typeOptions = [{
    value: Type.PROFILECOMPONENT,
    label: 'Profile Components',
  }, {
    value: Type.COMPOSITEPROFILE,
    label: 'Composite Profiles',
  }, {
    value: Type.CONFORMANCEPROFILE,
    label: 'Conformance Profiles',
  }, {
    value: Type.SEGMENT,
    label: 'Segments',
  }, {
    value: Type.DATATYPE,
    label: 'Datatypes',
  }, {
    value: Type.VALUESET,
    label: 'ValueSets',
  }, {
    value: Type.COCONSTRAINTGROUP,
    label: 'Co-Constraint Group',
  }];
  constructor() {
    this.update = new EventEmitter();
    this.activeFilter = {
      usedInConformanceProfiles: {
        active: false,
        conformanceProfiles: [],
        exclude: true,
        usages: [],
      },
      hideNarratives: false,
      filterByType: {
        active: false,
        allow: true,
        types: [],
      },
      filterByScope: {
        active: false,
        allow: true,
        scopes: [],
      },
      filterByDerived: {
        active: false,
        allow: true,
        value: false,
      },
    };
    this.scopeOptions = Object.values(Scope).map((scope) => ({
      label: scope,
      value: scope,
    }));
  }

  onOpenChange(value) {
    if (value === false) {
      this.apply();
    }
  }

  apply() {
    this.active = this.isActive();
    this.update.emit(this.activeFilter);
  }

  isActive() {
    if (this.activeFilter) {
      const usedInConformanceProfile = this.activeFilter.usedInConformanceProfiles && this.activeFilter.usedInConformanceProfiles.active;
      const hideNarratives = this.activeFilter.hideNarratives;
      const filterByType = this.activeFilter.filterByType && this.activeFilter.filterByType.active;
      const filterByScopes = this.activeFilter.filterByScope && this.activeFilter.filterByScope.active;
      const filterByDerived = this.activeFilter.filterByDerived && this.activeFilter.filterByDerived.active;
      return usedInConformanceProfile || hideNarratives || filterByType || filterByScopes || filterByDerived;
    } else {
      return false;
    }
  }

  ngOnInit() {
  }

}
