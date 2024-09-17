import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { TreeNode } from 'angular-tree-component';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map, take, withLatestFrom } from 'rxjs/operators';
import { IgTocFilterService } from 'src/app/modules/ig/services/ig-toc-filter.service';
import { Usage } from 'src/app/modules/shared/constants/usage.enum';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { ToggleDelta } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import {
  selectDelta,
  selectDerived,
  selectIgId,
} from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { IgService } from '../../../ig/services/ig.service';
import { LibraryService } from '../../../library/services/library.service';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IExportConfigurationGlobal } from '../../models/config.interface';
import { ExportTypes } from '../../models/export-types';
import { UsageConfiguration } from '../../models/usageConfiguration';
import { ConfigurationTocComponent, ProfileActionEventData, ProfileActionEventType } from '../configuration-toc/configuration-toc.component';

@Component({
  selector: 'app-export-configuration-dialog',
  templateUrl: './export-configuration-dialog.component.html',
  styleUrls: ['./export-configuration-dialog.component.scss'],
})
export class ExportConfigurationDialogComponent implements OnInit {
  selected: IDisplayElement;
  type: Type;
  docType: ExportTypes;
  @ViewChild(ConfigurationTocComponent) toc;
  initialConfig: IExportConfigurationGlobal;
  filter: any;
  loading = false;
  defaultConfig: any;
  nodes: Observable<TreeNode>;
  deltaMode$: Observable<boolean>;
  current: any = {};
  derived: boolean;
  delta: any;
  selectedDeltaValues = ['ADDED', 'UPDATED'];
  configurationName: string;
  documentId: string;
  removedProfiles: string[] = [];  // Array to keep track of removed conformance profiles


  constructor(
    public dialogRef: MatDialogRef<ExportConfigurationDialogComponent>,
    private libraryService: LibraryService,
    private igService: IgService,
    private igTocFilterService: IgTocFilterService,
    @Inject(MAT_DIALOG_DATA) public data: any, private store: Store<any>) {
    this.initialConfig = data.decision;

    console.log(this.initialConfig);
    console.log(this.initialConfig.exportConfiguration.conformamceProfileExportConfiguration.segmentORGroupsMessageExport);
    console.log(this.getUsagesToInclude(this.initialConfig.exportConfiguration.conformamceProfileExportConfiguration.segmentORGroupsMessageExport));

    this.nodes = data.toc;
    this.configurationName = data.configurationName;
    this.deltaMode$ = this.store.select(selectDelta);
    this.store.select(selectDerived).pipe(take(1)).subscribe((x) => this.derived = x);
    this.filter = this.initialConfig.exportFilterDecision;
    
    //change this.filter to update new dependencies selection
    this.defaultConfig = _.cloneDeep(data.decision.exportConfiguration);
    this.type = data.type;
    this.docType = data.type;
    this.delta = data.delta;
    this.documentId = data.documentId;
  }

//create function selectProfileWithDependencies(id profile) and calls back end, the goal is to return the Id of dependencies 
// subscribes to observables and call following function with the IDS
//  (this.dialog.open(ConfirmDialogComponent ) When unselecting a profile and its dependencies, prompt a warning dialog stating that some of the dependencies might be also used in another profile, unselecting this profile, will result in unselecting thoses dependencies for all profiles
//create function updateFilter(listIds) ==> updates filterObject, this will be inside of first function, doing something different for each context menu option

handleProfileAction(data: ProfileActionEventData) {
  if(data.type === ProfileActionEventType.ADD || data.type === ProfileActionEventType.SELECT_ONLY) {
    this.addProfileAndDependencies(data.profileId);

          // If the profile was previously removed, remove it from the removedProfiles list
    this.removedProfiles = this.removedProfiles.filter(id => id !== data.profileId);
  } else if (data.type === ProfileActionEventType.UNSELECT) {
    this.unselectProfileAndDependencies(data.profileId);

       // Add the profile to the removedProfiles list
       if (!this.removedProfiles.includes(data.profileId)) {
        this.removedProfiles.push(data.profileId);
      }
    
   // Iterate over other conformance profiles and call addProfileAndDependencies
   const otherConformanceProfiles = Object.keys(this.filter.conformanceProfileFilterMap)
   .filter(id => id !== data.profileId && !this.removedProfiles.includes(id));

    otherConformanceProfiles.forEach(profileId => {
      this.addProfileAndDependencies(profileId);
    });
  }

}
addProfileAndDependencies(profileId: string) {
  this.igTocFilterService.getResourceIdsForConformanceProfile(profileId, this.getUsagesToInclude(this.initialConfig.exportConfiguration.conformamceProfileExportConfiguration.segmentORGroupsMessageExport)).subscribe(response => {
    response.conformanceProfiles.forEach(id => {
      this.filter.conformanceProfileFilterMap[id] = true;
    });
    response.segments.forEach(id => {
      this.filter.segmentFilterMap[id] = true;
    });
    response.datatypes.forEach(id => {
      this.filter.datatypesFilterMap[id] = true;
    });
    response.valueSets.forEach(id => {
      this.filter.valueSetFilterMap[id] = true;
    });
  });
}  
unselectProfileAndDependencies(profileId: string) {
  this.igTocFilterService.getResourceIdsForConformanceProfile(profileId, []).subscribe(response => {
    response.conformanceProfiles.forEach(id => {
      this.filter.conformanceProfileFilterMap[id] = false;
    });
    response.segments.forEach(id => {
      this.filter.segmentFilterMap[id] = false;
    });
    response.datatypes.forEach(id => {
      this.filter.datatypesFilterMap[id] = false;
    });
    response.valueSets.forEach(id => {
      this.filter.valueSetFilterMap[id] = false;
    });
  });
}



// addProfileAndDependencies(profileId: string): void {
//   console.log('Inside addProfileAndDependencies ');
//   this.igTocFilterService.getResourceIdsForConformanceProfile(profileId, this.initialConfig.exportConfiguration.conformamceProfileExportConfiguration).subscribe(response => {
//     response.conformanceProfiles.forEach(id => {
//       this.filter.conformanceProfileFilterMap[id] = true;
//     });
//     response.segments.forEach(id => {
//       this.filter.segmentFilterMap[id] = true;
//     });
//     response.datatypes.forEach(id => {
//       this.filter.datatypesFilterMap[id] = true;
//     });
//     response.valueSets.forEach(id => {
//       this.filter.valueSetFilterMap[id] = true;
//     });
//   });
// }

  selectOverrideOrDefault(node, overiddedMap, defaultConfig) {
    if (overiddedMap[node.id]) {
      this.current = overiddedMap[node.id];
    } else {
      this.current = _.cloneDeep(defaultConfig);
    }
    this.loading = false;
  }

  select(node) {
    this.loading = true;
    this.selected = node;
    this.type = node.type;
    switch (this.type) {
      case Type.SEGMENT: {
        this.selectOverrideOrDefault(node, this.filter.overiddedSegmentMap, this.defaultConfig.segmentExportConfiguration);
        break;
      }
      case Type.DATATYPE: {
        this.selectOverrideOrDefault(node, this.filter.overiddedDatatypesMap, this.defaultConfig.datatypeExportConfiguration);
        break;
      }
      case Type.CONFORMANCEPROFILE: {
        this.selectOverrideOrDefault(node, this.filter.overiddedConformanceProfileMap, this.defaultConfig.conformamceProfileExportConfiguration);
        break;
      }
      case Type.COMPOSITEPROFILE: {
        this.selectOverrideOrDefault(node, this.filter.overiddedCompositeProfileMap, this.defaultConfig.compositeProfileExportConfiguration);
        break;
      }
      case Type.VALUESET: {
        this.selectOverrideOrDefault(node, this.filter.overiddedValueSetMap, this.defaultConfig.valueSetExportConfiguration);
        break;
      }
      default: {
        break;
      }
    }
  }

  applyChange(event: any) {
    switch (this.type) {
      case Type.SEGMENT: {
        this.filter.overiddedSegmentMap[this.selected.id] = event;
        break;
      }
      case Type.DATATYPE: {
        this.filter.overiddedDatatypesMap[this.selected.id] = event;
        break;
      }
      case Type.CONFORMANCEPROFILE: {
        this.filter.overiddedConformanceProfileMap[this.selected.id] = event;
        break;
      }
      case Type.VALUESET: {
        this.filter.overiddedValueSetMap[this.selected.id] = event;
        break;
      }
    }
  }

  ngOnInit() {
  }

  applyLastUserConfiguration() {
    if (this.initialConfig.previous) {
      this.filter = this.initialConfig.previous;
    }
  }

  submit() {
    this.dialogRef.close(this.filter);
  }

  cancel() {
    this.dialogRef.close();
  }

  filterFn(value: any) {
    this.toc.filter(value);
  }

  scrollTo(messages: string) {
    this.toc.scrollTo(messages);
  }

  toggleDelta() {
    this.toc.filter('');
    this.store.select(selectIgId).pipe(
      take(1),
      withLatestFrom(this.deltaMode$),
      map(([id, delta]) => {
        this.store.dispatch(new ToggleDelta(id, !delta));
      }),
    ).subscribe();
  }

  mergeDeltaFilter($event: string[], key: string) {
    let ret = false;
    if ($event.indexOf('ADDED') > -1) {
      ret = this.filter.added[key] || ret;
    }
    if ($event.indexOf('UPDATED') > -1) {
      ret = this.filter.changed[key] || ret;
    }
    return ret;
  }

  applyFilter($event: string[], obj: any) {
    Object.keys(obj).forEach((key) => {
      obj[key] = this.mergeDeltaFilter($event, key);
    },
    );
  }

  filterByDelta($event: string[]) {
    this.applyFilter($event, this.filter.datatypesFilterMap);
    this.applyFilter($event, this.filter.segmentFilterMap);
    this.applyFilter($event, this.filter.valueSetFilterMap);
    this.applyFilter($event, this.filter.conformanceProfileFilterMap);
  }

  getUsagesToInclude(config: UsageConfiguration | undefined): Usage[] {
    if (!config) {
      console.warn("getUsagesToInclude called with undefined config ");
      return [];
    }
  
    const usages: Usage[] = [];
  
    if (config.r) {
      usages.push(Usage.R);
    }
    if (config.re) {
      usages.push(Usage.RE);
    }
    if (config.c) {
      usages.push(Usage.C);
    }
    if (config.x) {
      usages.push(Usage.X);
    }
    if (config.o) {
      usages.push(Usage.O);
    }
    if (config.cab) {
      usages.push(Usage.CAB);
    }
    if (config.w) {
      usages.push(Usage.W);
    }
    if (config.b) {
      usages.push(Usage.B);
    }
    if (config.ix) {
      usages.push(Usage.IX);
    }
  
    return usages;
  }
}
