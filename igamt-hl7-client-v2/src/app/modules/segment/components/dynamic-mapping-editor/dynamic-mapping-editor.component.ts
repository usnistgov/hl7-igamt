import { Component, OnInit } from '@angular/core';
import {setHebrewDay} from '@ng-bootstrap/ng-bootstrap/datepicker/hebrew/hebrew';
import {Actions} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {combineLatest} from 'rxjs';
import {Observable, of} from 'rxjs';
import {map, mergeMap, take} from 'rxjs/operators';
import {EditorSave} from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import * as fromIgEdit from '../../../../root-store/ig/ig-edit/ig-edit.index';
import {selectAllDatatypes, selectIgId} from '../../../../root-store/ig/ig-edit/ig-edit.index';
import {AbstractEditorComponent} from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import {MessageService} from '../../../core/services/message.service';
import {IgService} from '../../../ig/services/ig.service';
import {Type} from '../../../shared/constants/type.enum';
import {IStructureElementBinding} from '../../../shared/models/binding.interface';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {EditorID} from '../../../shared/models/editor.enum';
import {IDynamicMappingInfo, ISegment} from '../../../shared/models/segment.interface';
import {IValueSet} from '../../../shared/models/value-set.interface';
import {ValueSetService} from '../../../value-set/service/value-set.service';

@Component({
  selector: 'app-dynamic-mapping-editor',
  templateUrl: './dynamic-mapping-editor.component.html',
  styleUrls: ['./dynamic-mapping-editor.component.css'],
})
export class DynamicMappingEditorComponent extends AbstractEditorComponent implements OnInit  {
  table$: Observable<IValueSet>;
  datatypes$: Observable<IDisplayElement[]>;
  constructor(
    store: Store<fromIgEdit.IState>,
    actions$: Actions,
    private valueSetService: ValueSetService,
    private messageService: MessageService) {
    super(
      {
        id: EditorID.DYNAMIC_MAPPING,
        resourceType: Type.SEGMENT,
        title: 'Dynamic mapping',
      },
      actions$,
      store,
    );
    this.datatypes$ = this.store.select(selectAllDatatypes);
  }
  ngOnInit() {
  this.table$ = combineLatest(this.initial$, this.store.select(selectIgId)).pipe(
     take(1),
      mergeMap(([segment, ig]) => {
      if (segment.binding != null && segment.binding.children && segment.binding.children.length) {
        const obx2Binding =  segment.binding.children.find((x: IStructureElementBinding) => x.locationInfo && x.locationInfo.position === 2);
        if (obx2Binding && obx2Binding.valuesetBindings.length > 0) {
         const vsb = obx2Binding.valuesetBindings[0];
         if (vsb.valueSets && vsb.valueSets.length > 0) {
           return this.valueSetService.getById(ig, vsb.valueSets);
         }
        }
      }
      return of(null);
    }));
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return undefined;
  }

  onDeactivate(): void {
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return undefined;
  }

  onChange(data: IDynamicMappingInfo) {
    this.editorChange(data, true);
  }
}