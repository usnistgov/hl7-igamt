import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { SelectItem } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { LoadValueSet } from 'src/app/root-store/value-set-edit/value-set-edit.actions';
import { selectIgId, selectValueSetById } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { StructureEditorComponent } from '../../../core/components/structure-editor/structure-editor.component';
import { Message } from '../../../core/models/message/message.class';
import { MessageService } from '../../../core/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { SourceType } from '../../../shared/models/adding-info';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { IChange } from '../../../shared/models/save-change';
import { IValueSet } from '../../../shared/models/value-set.interface';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { ValueSetService } from '../../service/value-set.service';

@Component({
  selector: 'app-value-set-structure-editor',
  templateUrl: './value-set-structure-editor.component.html',
  styleUrls: ['./value-set-structure-editor.component.css'],
})
export class ValueSetStructureEditorComponent extends StructureEditorComponent<IValueSet> implements OnDestroy, OnInit {

  selectedColumns: any[] = [];
  cols: any[] = [];
  @Input()
  viewOnly: boolean;
  codeSystemOptions: any[];

  constructor(
    readonly repository: StoreResourceRepositoryService,
    private valueSetService: ValueSetService,
    messageService: MessageService,
    actions$: Actions,
    store: Store<any>) {
    super(
      repository,
      messageService,
      actions$,
      store,
      {
        id: EditorID.VALUESET_STRUCTURE,
        title: 'Structure',
        resourceType: Type.VALUESET,
      },
      LoadValueSet,
      [
      ],
      [
      ]);
    this.resource$.subscribe((resource: IValueSet) => {
      this.cols = [];
      this.cols.push({ field: 'value', header: 'Value' });
      this.cols.push({ field: 'description', header: 'Description' });
      this.cols.push({ field: 'codeSystem', header: 'Code System' });
      if (resource.sourceType !== SourceType.EXTERNAL) {
        this.cols.push({ field: 'usage', header: 'Usage' });
      }
      this.cols.push({ field: 'comments', header: 'Comments' });
      this.selectedColumns = this.cols;
      this.codeSystemOptions = this.getCodeSystemOptions(resource);
    });
  }
  getCodeSystemOptions(resource: IValueSet): SelectItem[] {
    if (resource.codeSystems && resource.codeSystems.length > 0) {
      return resource.codeSystems.map((codeSystem: string) => {
        return { label: codeSystem, value: codeSystem };
      });
    } else {
      return [];
    }

  }
  saveChanges(id: string, igId: string, changes: IChange[]): Observable<Message<any>> {
    return this.valueSetService.saveChanges(id, igId, changes);
  }
  getById(id: string): Observable<IValueSet> {
    return this.store.select(selectIgId).pipe(
      take(1),
      mergeMap((x) => {
        return this.valueSetService.getById(x, id);
      }),
    );
  }
  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return selectValueSetById;
  }

  isDTM(): Observable<boolean> {
    return of(false);
  }

}
