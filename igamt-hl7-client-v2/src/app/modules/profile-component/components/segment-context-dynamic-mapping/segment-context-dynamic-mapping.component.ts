import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {forEach} from '@angular/router/src/utils/collection';
import {Actions} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import * as _ from 'lodash';
import {BehaviorSubject, combineLatest, Observable, Subscription, throwError} from 'rxjs';
import {catchError, concatMap, flatMap, map, mergeMap, pluck, take, withLatestFrom} from 'rxjs/operators';
import {
  selectAllDatatypes, selectContextById,
  selectValueSetById,
} from '../../../../root-store/dam-igamt/igamt.resource-display.selectors';
import {selectSelectedProfileComponent} from '../../../../root-store/dam-igamt/igamt.selected-resource.selectors';
import {AbstractEditorComponent} from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import {Message, MessageType} from '../../../dam-framework/models/messages/message.class';
import {MessageService} from '../../../dam-framework/services/message.service';
import * as fromDam from '../../../dam-framework/store';
import {EditorSave} from '../../../dam-framework/store/data';
import {Type} from '../../../shared/constants/type.enum';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {EditorID} from '../../../shared/models/editor.enum';
import { IPropertyDynamicMappingItem } from '../../../shared/models/profile.component';
import {ChangeType} from '../../../shared/models/save-change';
import {IDynamicMappingInfo, IDynamicMappingNaming} from '../../../shared/models/segment.interface';
import {StoreResourceRepositoryService} from '../../../shared/services/resource-repository.service';
import {ProfileComponentService} from '../../services/profile-component.service';

@Component({
  selector: 'app-segment-context-dynamic-mapping',
  templateUrl: './segment-context-dynamic-mapping.component.html',
  styleUrls: ['./segment-context-dynamic-mapping.component.css'],
})
export class SegmentContextDynamicMappingComponent extends AbstractEditorComponent implements OnInit, OnDestroy {
  datatypes$: Observable<IDisplayElement[]>;
  segmentVsDisplay$: Observable<IDisplayElement>;
  profileComponentId$: Observable<string>;
  pcVsDisplay$: Observable<IDisplayElement>;
  segmentDynamicMapping$: Observable<IDynamicMappingInfo>;
  profileComponentDynamicMapping$: BehaviorSubject<IPropertyDynamicMappingItem[]>;
  segmentDynamicMappingDisplay$: Observable<IDynamicMappingItemDisplay[]>;
  profileComponentDynamicMappingDisplay$: Observable<IDynamicMappingItemDisplay[]>;
  dynamicMappinInfo$: Observable<IDynamicMappingEditorInfo>;
  datatypeMap$: Observable<{ [k: string]: IDisplayElement}>;
  availableMapping$: Observable<IDynamicMappingNaming>;
  s_workspace: Subscription;

  constructor(
    readonly repository: StoreResourceRepositoryService,
    private messageService: MessageService,
    private pcService: ProfileComponentService,
    dialog: MatDialog,
    actions$: Actions,
    store: Store<any>,
  ) {
    super(   {
      id: EditorID.PC_SEGMENT_CTX_DYNAMIC_MAPPING,
      title: 'Dynamic Mapping',
      resourceType: Type.SEGMENTCONTEXT,
    }, actions$, store);

    this.datatypes$ = this.store.select(selectAllDatatypes);
    this.datatypeMap$ = this.datatypes$.pipe(map((list) => {
      return Object.assign({}, ...list.map((s) => ({[s.id]: s})));
    }));

    this.segmentVsDisplay$ = this.current$.pipe(
      mergeMap((current) => {
        return this.store.select(selectValueSetById, {id: current.data.segmentVs});
      }),
    );
    this.pcVsDisplay$ = this.current$.pipe(
      mergeMap((current) => {
        return this.store.select(selectValueSetById, {id: current.data.pcVs != null ? current.data.pcVs : current.data.segmentVs });
      }),
    );

    this.segmentDynamicMapping$ = this.current$.pipe(
      map((current) => {
        return current.data.segmentDynamicMapping;
      }),
    );

    this.profileComponentId$ = this.store.select(selectSelectedProfileComponent).pipe(
      pluck('id'),
    );

    this.profileComponentDynamicMapping$ = new BehaviorSubject([]);

    this.dynamicMappinInfo$ =  this.current$.pipe(
       map((current) => {
         return current.data;
       }),
    );

    this.s_workspace = this.currentSynchronized$.pipe(
      map((data: IDynamicMappingEditorInfo) => {
        this.profileComponentDynamicMapping$.next([...data.profileComponentDynamicMapping]);
      }),
    ).subscribe();

    this.availableMapping$ = combineLatest(this.current$, this.documentRef$, this.datatypes$ ).pipe(
      mergeMap(([current, documemtRef, datatypes]) => {
        return this.pcService.getAvailableCodes(current.data.pcVs, current.data.segmentVs, documemtRef).pipe(map((values) => {
          return this.group(values, datatypes);
        } ));
      }),
    );
    this.segmentDynamicMappingDisplay$ = combineLatest(this.availableMapping$, this.profileComponentDynamicMapping$, this.segmentDynamicMapping$, this.datatypeMap$).pipe(
      map(([ available, pcMapping , segmentMappingItems, datatypesMap]  ) => {
        return this.processSegmentMapping(available, pcMapping, segmentMappingItems, datatypesMap);
      }));

    this.profileComponentDynamicMappingDisplay$ = combineLatest(this.availableMapping$, this.profileComponentDynamicMapping$, this.datatypeMap$).pipe(
      map(([ available, pcMapping, datatypesMap]  ) => {
        return this.processPcMapping(available, pcMapping, datatypesMap);
      }));

  }

  ngOnInit() {
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return combineLatest(this.current$, this.profileComponentId$, this.elementId$).pipe(
      take(1),
      concatMap(([current, pcId, id]) => {
        return this.pcService.saveDynamicMapping(pcId, id, current.data.profileComponentDynamicMapping).pipe(
          flatMap((value) => {
            return this.pcService.getChildById(pcId, id).pipe(
              flatMap((context) => {
                return [
                  this.messageService.messageToAction(new Message<any>(MessageType.SUCCESS, 'Dynamic Mapping saved successfully!', null)),
                  new fromDam.EditorUpdate({ value: current.data, updateDate: false }),
                  new fromDam.SetValue({ selected: context }),
                ];
              }),
            );
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      concatMap((id) => {
        return this.store.select(selectContextById, { id });
      }),
    );
  }

  processSegmentMapping(available: IDynamicMappingInfo, pcMapping: IPropertyDynamicMappingItem[], segmentMappingItems: IDynamicMappingInfo, datatypesMap: {[p: string]: IDisplayElement}): IDynamicMappingItemDisplay[] {
    const ret: IDynamicMappingItemDisplay[] = [];
    if (segmentMappingItems && segmentMappingItems.items) {
      segmentMappingItems.items.forEach((x) => {
        if (pcMapping.filter((p) => p.payload.value === x.value).length > 0) {
          ret.push({status: DynamicMappingStatus.INACTIVE, display: datatypesMap[x.datatypeId], value: x.value});
        } else if (!available[x.value]) {
          ret.push({status: DynamicMappingStatus.INVALID, display: datatypesMap[x.datatypeId], value: x.value});
        } else {
          ret.push({status: DynamicMappingStatus.ACTIVE, display: datatypesMap[x.datatypeId], value: x.value});
        }
      });
    }
    return ret;
  }
  private group(values: string[], datatypes: IDisplayElement[]): IDynamicMappingNaming {
   return _.groupBy(datatypes.filter((x) => values.indexOf(x.fixedName) > -1), 'fixedName');
  }

  private processPcMapping(available: IDynamicMappingNaming, pcMapping: IPropertyDynamicMappingItem[], datatypesMap: { [p: string]: IDisplayElement }): IDynamicMappingItemDisplay[] {

    return pcMapping.map((x) => ({ status: DynamicMappingStatus.ACTIVE, display: datatypesMap[x.payload.datatypeId] , value: x.payload.value , changeType : x.change }));
  }

  update($event: IPropertyDynamicMappingItem[]) {
    this.registerChange($event);
  }

  registerChange(list: IPropertyDynamicMappingItem[]) {
    this.dynamicMappinInfo$.pipe(
      take(1),
      map(( data: IDynamicMappingEditorInfo) => {
        this.profileComponentDynamicMapping$.next(list);
        this.editorChange({
        ...data, profileComponentDynamicMapping: [...list],
        }, true);
      }),
    ).subscribe();
  }

  ngOnDestroy(): void {
    if (this.s_workspace) {
      this.s_workspace.unsubscribe();
    }
  }

  onDeactivate() {
    this.ngOnDestroy();
  }
}

export interface IDynamicMappingEditorInfo {
  segmentVs: string;
  pcVs: string;
  segmentDynamicMapping: IDynamicMappingInfo;
  profileComponentDynamicMapping?: IPropertyDynamicMappingItem[];
}

export enum DynamicMappingStatus {
  ACTIVE = 'ACTIVE',
  INVALID = 'INVALID',
  INACTIVE = 'INACTIVE',
}
export interface IDynamicMappingItemDisplay {
  status: DynamicMappingStatus;
  value: string ;
  display: IDisplayElement;
  changeType?: ChangeType;
}
