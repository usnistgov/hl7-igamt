import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { selectBindingConfig } from '../../../root-store/config/config.reducer';
import { RxjsStoreHelperService } from '../../dam-framework/services/rxjs-store-helper.service';
import { IBindingLocationInfo, ISingleCodeDisplay, IValueSetBindingDisplay } from '../components/binding-selector/binding-selector.component';
import { Type } from '../constants/type.enum';
import { IFlatResourceBindings, InternalSingleCode, IValuesetBinding } from '../models/binding.interface';
import { IBindingLocationInfoConfig } from '../models/config.class';
import { IVerificationIssue } from '../models/verification.interface';
import { AResourceRepositoryService } from './resource-repository.service';

function contains(locationExceptions: IBindingLocationInfoConfig[], version: string, location: number, type: Type, parent: string) {
  return locationExceptions.filter((x: IBindingLocationInfoConfig) => {
    return parent === x.name && type === x.type && location === x.location && x.version.includes(version);
  }).length > 0;
}

@Injectable({
  providedIn: 'root',
})
export class BindingService {

  constructor(private http: HttpClient, private store: Store<any>) { }

  getResourceBindings = (type: Type, id: string): Observable<IFlatResourceBindings> => {
    return this.http.get<IFlatResourceBindings>('api/bindings/' + type + '/' + id);
  }

  getVerifyResourceBindings = (type: Type, id: string): Observable<IVerificationIssue[]> => {
    return this.http.get<IVerificationIssue[]>('api/bindings/' + type + '/' + id + '/verify');
  }

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

  getSingleCodeBindingDisplay(singleCode: InternalSingleCode, repository: AResourceRepositoryService): Observable<ISingleCodeDisplay> {
    return repository.getResourceDisplay(Type.VALUESET, singleCode.valueSetId).pipe(
      take(1),
      map((vs) => {
        return {
          valueSet: vs,
          code: singleCode.code,
          codeSystem: singleCode.codeSystem,
        };
      }),
    );
  }

  getBingdingInfo(version: string, parent: string, elementName: string, location: number, type: Type): BehaviorSubject<IBindingLocationInfo> {
    const vsBindingInfo = new BehaviorSubject<IBindingLocationInfo>(null);
    this.store.select(selectBindingConfig).pipe(
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
    ).subscribe(vsBindingInfo);
    return vsBindingInfo;
  }

}
