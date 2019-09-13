import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectBindingConfig } from '../../../root-store/config/config.reducer';
import { IBindingLocationInfo } from '../components/binding-selector/binding-selector.component';
import { Type } from '../constants/type.enum';
import { IBindingLocationInfoConfig } from '../models/config.class';

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

  getBingdingInfo(version: string, parent: string, elementName: string, location: number, type: Type): Observable<IBindingLocationInfo> {
    return this.store.select(selectBindingConfig).pipe(
      map((valueSetBindingConfig) => {
        const ret: IBindingLocationInfo = {
          allowedBindingLocations: [],
          singleCodeAllowed: false,
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
            ret.singleCodeAllowed = config.allowSingleCode;
            ret.coded = config.allowSingleCode;
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
