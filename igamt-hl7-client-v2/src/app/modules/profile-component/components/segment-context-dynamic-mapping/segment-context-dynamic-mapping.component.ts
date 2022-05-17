import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Actions} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import * as _ from 'lodash';
import {BehaviorSubject, combineLatest, Observable, Subscription, throwError} from 'rxjs';
import {catchError, concatMap, flatMap, map, mergeMap, pluck, take} from 'rxjs/operators';
import {
  selectAllDatatypes,
  selectContextById, selectSegmentsById,
  selectValueSetById,
} from '../../../../root-store/dam-igamt/igamt.resource-display.selectors';
import {selectSelectedProfileComponent} from '../../../../root-store/dam-igamt/igamt.selected-resource.selectors';
import {selectViewOnly} from '../../../../root-store/dam-igamt/igamt.selectors';
import {selectDelta} from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import {AbstractEditorComponent} from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import {Message, MessageType} from '../../../dam-framework/models/messages/message.class';
import {MessageService} from '../../../dam-framework/services/message.service';
import * as fromDam from '../../../dam-framework/store';
import {EditorSave} from '../../../dam-framework/store/data';
import {Type} from '../../../shared/constants/type.enum';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {EditorID} from '../../../shared/models/editor.enum';
import {
  DynamicMappingStatus,
  IPcDynamicMappingItem,
  IProfileComponent,
  IPropertyDynamicMapping,
} from '../../../shared/models/profile.component';
import {ChangeType, PropertyType} from '../../../shared/models/save-change';
import {
  IDynamicMappingInfo,
  IDynamicMappingItem,
  IDynamicMappingNaming,
} from '../../../shared/models/segment.interface';
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
  profileComponentDynamicMapping$: BehaviorSubject<IPropertyDynamicMapping>;
  segmentDisplay$: Observable<IDisplayElement>;
  profileComponentDynamicMappingDisplay$: Observable<IDynamicMappingItemDisplay[]>;
  dynamicMappingInfo$: Observable<IDynamicMappingEditorInfo>;
  datatypeMap$: Observable<{ [k: string]: IDisplayElement}>;
  availableMapping$: Observable<IDynamicMappingNaming>;
  override$: Observable<boolean>;
  containsInvalid$: Observable<boolean>;
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
    this.pcVsDisplay$ = this.current$.pipe(
      mergeMap((current) => {
        return this.store.select(selectValueSetById, {id: current.data.pcVs != null ? current.data.pcVs : current.data.segmentVs });
      }),
    );

    this.segmentDisplay$ = this.current$.pipe(
      mergeMap((current) => {
        return this.store.select(selectSegmentsById, {id: current.data.segmentId });
      }),
    );
    this.segmentDynamicMapping$ = this.current$.pipe(
      map((current) => {
        return current.data.segmentDynamicMapping;
      }),
    );

    this.override$ = this.current$.pipe(
      map((current) => {
        if  ( current.data.profileComponentDynamicMapping ) {
          return current.data.profileComponentDynamicMapping.override;
        }
        return false;
      }),
    );
    this.profileComponentId$ = this.store.select(selectSelectedProfileComponent).pipe(
      pluck('id'),
    );
    this._viewOnly$ = combineLatest(
      this.store.select(selectViewOnly),
      this.store.select(selectDelta),
      this.store.select(selectSelectedProfileComponent)).pipe(
      map(([vOnly, delta, pc]) => {
        return vOnly || delta || pc.derived ;
      }),
    );

    const init: IPropertyDynamicMapping = {items: [], override: false, propertyKey: PropertyType.DYNAMICMAPPINGITEM};
    this.profileComponentDynamicMapping$ = new BehaviorSubject(init);

    this.dynamicMappingInfo$ =  this.current$.pipe(
       map((current) => {
         return current.data;
       }),
    );

    this.s_workspace = this.currentSynchronized$.pipe(
      map((data: IDynamicMappingEditorInfo) => {
        this.profileComponentDynamicMapping$.next(data.profileComponentDynamicMapping);
      }),
    ).subscribe();

    this.availableMapping$ = combineLatest(this.current$, this.documentRef$, this.datatypes$ ).pipe(
      mergeMap(([current, documemtRef, datatypes]) => {
        return this.pcService.getAvailableCodes(current.data.pcVs, current.data.segmentVs, documemtRef).pipe(map((values) => {
          return this.group(values, datatypes);
        } ));
      }),
    );
    this.profileComponentDynamicMappingDisplay$ = combineLatest(this.availableMapping$, this.profileComponentDynamicMapping$, this.segmentDynamicMapping$, this.datatypeMap$ , this.override$).pipe(
      map(([ available, pcMapping, segmentMappingItems, datatypesMap, override]  ) => {
        return this.processPcMapping(available, pcMapping && pcMapping.items ? pcMapping.items : [] , segmentMappingItems && segmentMappingItems.items ? segmentMappingItems.items : [] , datatypesMap, override);
      }));

    this.containsInvalid$ = combineLatest(this.profileComponentDynamicMappingDisplay$ , this.availableMapping$).pipe(
      map(([ pcMapping, available]  ) => {
        if ( pcMapping && available ) {
          return pcMapping.filter((x) => x.status === DynamicMappingStatus.INVALID).length > 0;
        } else {
          return false;
        }
      }));

  }

  ngOnInit() {
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return combineLatest(this.current$, this.profileComponentId$, this.elementId$, this.documentRef$).pipe(
      take(1),
      concatMap(([current, pcId, id, documentRef]) => {
        return this.pcService.saveDynamicMapping(pcId, id, current.data.profileComponentDynamicMapping, documentRef).pipe(
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

  private group(values: string[], datatypes: IDisplayElement[]): IDynamicMappingNaming {
   return _.groupBy(datatypes.filter((x) => values.indexOf(x.fixedName) > -1), 'fixedName');
  }

  // tslint:disable-next-line:cognitive-complexity
  private processPcMapping(available: IDynamicMappingNaming, pcItems: IPcDynamicMappingItem[], segmentMappingItems: IDynamicMappingItem[], datatypesMap: { [p: string]: IDisplayElement }, override: boolean ): IDynamicMappingItemDisplay[] {
    let ret: IDynamicMappingItemDisplay[] = [];

    if (override) {
        ret = pcItems.map((x) => ({
          status: available[x.datatypeName] ? DynamicMappingStatus.ACTIVE : DynamicMappingStatus.INVALID,
          display: datatypesMap[x.flavorId],
          value: x.datatypeName,
          changeType: x.change,
        }));
    } else {
      // tslint:disable-next-line:no-shadowed-variable
        const map = {};
        segmentMappingItems.forEach((x) => {
          const pcItem: IPcDynamicMappingItem =  pcItems.find((p) => p.datatypeName === x.value );
          if (pcItem != null ) {
          ret.push({
            status: available[pcItem.datatypeName] ? DynamicMappingStatus.ACTIVE : DynamicMappingStatus.INVALID,
            display: datatypesMap[pcItem.flavorId],
            value: pcItem.datatypeName,
            changeType: pcItem.change,
          });
          } else {
            ret.push({
              status:  available[x.value] ? DynamicMappingStatus.ACTIVE : DynamicMappingStatus.INVALID,
              display: datatypesMap[x.datatypeId],
              value: x.value,
              changeType: null,
            });
          }
          map[x.value] = true;
        });
        pcItems.forEach((x) => {
          if (!map[x.datatypeName]) {
            ret.push({status: DynamicMappingStatus.INVALID,
              display: datatypesMap[x.flavorId],
              value: x.datatypeName,
              changeType: x.change});
          }
      });
    }
    return ret;
  }

  update($event: IPcDynamicMappingItem[]) {
    this.registerChange($event);
  }
  registerChange(list: IPcDynamicMappingItem[]) {
    this.dynamicMappingInfo$.pipe(
      take(1),
      map(( data: IDynamicMappingEditorInfo) => {
        this.profileComponentDynamicMapping$.next({...data.profileComponentDynamicMapping , items: list});
        this.editorChange({
        ...data, profileComponentDynamicMapping: {...data.profileComponentDynamicMapping , items: list},
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
  profileComponentDynamicMapping?: IPropertyDynamicMapping;
  segmentId: string;
}

export interface IDynamicMappingItemDisplay {
  status: DynamicMappingStatus;
  value: string ;
  display: IDisplayElement;
  changeType?: ChangeType;
}
