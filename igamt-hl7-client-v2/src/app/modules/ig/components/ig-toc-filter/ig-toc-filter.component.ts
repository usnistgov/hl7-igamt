import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { SelectItem } from 'primeng/api';
import { IUsageOption } from '../../../shared/components/hl7-v2-tree/columns/usage/usage.component';
import { Scope } from '../../../shared/constants/scope.enum';
import { Type } from '../../../shared/constants/type.enum';
import { Hl7Config } from '../../../shared/models/config.class';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IIgTocFilterConfiguration } from '../../services/ig-toc-filter.service';

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
  }
  @Input()
  activeFilter: IIgTocFilterConfiguration;
  @Output()
  update: EventEmitter<IIgTocFilterConfiguration>;
  @Input()
  active: boolean;
  @Input()
  set config(c: Hl7Config) {
    this.usages = Hl7Config.getUsageOptions(c.usages, true, true, true);
  }
  usages: IUsageOption[];
  conformanceProfilesMap: Record<string, IDisplayElement>;
  conformanceProfileOptions: SelectItem[];
  scopeOptions: SelectItem[];
  typeOptions = [{
    value: Type.PROFILECOMPONENTREGISTRY,
    label: 'Profile Components',
  }, {
    value: Type.COMPOSITEPROFILEREGISTRY,
    label: 'Composite Profiles',
  }, {
    value: Type.CONFORMANCEPROFILEREGISTRY,
    label: 'Conformance Profiles',
  }, {
    value: Type.SEGMENTREGISTRY,
    label: 'Segments',
  }, {
    value: Type.DATATYPEREGISTRY,
    label: 'Datatypes',
  }, {
    value: Type.VALUESETREGISTRY,
    label: 'ValueSets',
  }, {
    value: Type.COCONSTRAINTGROUPREGISTRY,
    label: 'Co-Constraint Group',
  }];

  emptyFilter: IIgTocFilterConfiguration = {
    usedInConformanceProfiles: {
      active: false,
      conformanceProfiles: [],
      allow: true,
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
  };

  constructor() {
    this.update = new EventEmitter();
    this.activeFilter = _.cloneDeep(this.emptyFilter);
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
    this.update.emit(this.activeFilter);
  }

  clear() {
    this.activeFilter = _.cloneDeep(this.emptyFilter);
    this.update.emit(this.activeFilter);
  }

  ngOnInit() {
  }

}
