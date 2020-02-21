import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { selectBindingConfig } from '../../../root-store/config/config.reducer';
import { IBindingLocationInfo, IValueSetBindingDisplay } from '../components/binding-selector/binding-selector.component';
import { Type } from '../constants/type.enum';
import { IValuesetBinding } from '../models/binding.interface';
import { IBindingLocationInfoConfig } from '../models/config.class';
import { AResourceRepositoryService } from './resource-repository.service';
import { RxjsStoreHelperService } from './rxjs-store-helper.service';

function contains(locationExceptions: IBindingLocationInfoConfig[], version: string, location: number, type: Type, parent: string) {
  return locationExceptions.filter((x: IBindingLocationInfoConfig) => {
    return parent === x.name && type === x.type && location === x.location && x.version.includes(version);
  }).length > 0;
}

@Injectable({
  providedIn: 'root',
})
export class BindingService {

  constructor(private store: Store<any>) { }

  getValueSetBindingDisplay(bindings: IValuesetBinding[], repository: AResourceRepositoryService): Observable<IValueSetBindingDisplay[]> {
    return RxjsStoreHelperService.forkJoin(bindings.map((x) => {
      return combineLatest(
        of(x),
        RxjsStoreHelperService.forkJoin(x.valueSets.map((id) =>
          repository.getResourceDisplay(Type.VALUESET, id).pipe(
            take(1),
          )),
        ),
      );
    })).pipe(
      map((vsList) => {
        return vsList.map((vsB) => {
          const [binding, display] = vsB;
          return {
            valueSets: display,
            bindingStrength: binding.strength,
            bindingLocation: binding.valuesetLocations,
          };
        });
      }),
    );
  }

  getBingdingInfo(version: string, parent: string, elementName: string, location: number, type: Type): Observable<IBindingLocationInfo> {
    return this.store.select(selectBindingConfig).pipe(
      map((valueSetBindingConfig) => {
        const ret: IBindingLocationInfo = {
          allowedBindingLocations: [],
          multiple: false,
          coded: false,
          allowSingleCode: false,
          allowValueSets: false,
        };

        if (valueSetBindingConfig[elementName]) {
          const config = valueSetBindingConfig[elementName];
          if (config.locationIndifferent || contains(config.locationExceptions, version, location, type, parent)) {
            ret.multiple = config.multiple;
            ret.allowValueSets = true;
            ret.allowSingleCode = config.allowSingleCode;
            ret.coded = config.coded;
            if (config.allowedBindingLocations) {
              const versionKey = version.replace(/\./g, '-');
              if (config.allowedBindingLocations[versionKey]) {
                ret.allowedBindingLocations = config.allowedBindingLocations[versionKey];
              }
            }
          }
        }
        return ret;
      }),
    );
  }

}
