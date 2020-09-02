import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { combineLatest, Observable, of, Subscription, throwError } from 'rxjs';
import { catchError, concatMap, flatMap, take } from 'rxjs/operators';
import * as fromAuth from 'src/app/modules/dam-framework/store/authentication/index';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { HL7v2TreeColumnType } from 'src/app/modules/shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Hl7Config, IValueSetBindingConfigMap } from 'src/app/modules/shared/models/config.class';
import { IMessageStructure } from 'src/app/modules/shared/models/conformance-profile.interface';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { LoadResourceReferences } from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { getHl7ConfigState, selectBindingConfig } from '../../../../root-store/config/config.reducer';
import { selectSegmentStructureById } from '../../../../root-store/structure-editor/structure-editor.reducer';
import { MessageService } from '../../../dam-framework/services/message.service';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { IResource } from '../../../shared/models/resource.interface';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { StructureEditorComponent } from '../../services/structure-editor-component.abstract';
import { StructureEditorService } from '../../services/structure-editor.service';

@Component({
  selector: 'app-segment-structure-editor',
  templateUrl: './segment-structure-editor.component.html',
  styleUrls: ['./segment-structure-editor.component.scss'],
})
export class SegmentStructureEditorComponent extends StructureEditorComponent implements OnInit, OnDestroy {

  type = Type;
  public bindingConfig: Observable<IValueSetBindingConfigMap>;
  public config: Observable<Hl7Config>;
  username: Observable<string>;
  resource$: Observable<IMessageStructure>;
  workspace_s: Subscription;
  columns: HL7v2TreeColumnType[];
  public datatypes: Observable<IDisplayElement[]>;

  constructor(
    actions$: Actions,
    store: Store<any>,
    private structureEditorService: StructureEditorService,
    private messageService: MessageService,
    public repository: StoreResourceRepositoryService,
  ) {
    super({
      id: EditorID.SEGMENT_CUSTOM_STRUCTURE,
      title: 'Structure',
      resourceType: Type.SEGMENT,
    }, actions$, store);
    this.columns = [
      HL7v2TreeColumnType.NAME,
      HL7v2TreeColumnType.DATATYPE,
      HL7v2TreeColumnType.SEGMENT,
      HL7v2TreeColumnType.USAGE,
      HL7v2TreeColumnType.VALUESET,
      HL7v2TreeColumnType.CONSTANTVALUE,
      HL7v2TreeColumnType.CARDINALITY,
      HL7v2TreeColumnType.LENGTH,
      HL7v2TreeColumnType.CONFLENGTH,
      HL7v2TreeColumnType.TEXT,
      HL7v2TreeColumnType.COMMENT,
    ];
    this.config = this.store.select(getHl7ConfigState);
    this.username = this.store.select(fromAuth.selectUsername);
    this.bindingConfig = this.store.select(selectBindingConfig);
    this.datatypes = this.store.select(fromIgamtDisplaySelectors.selectAllDatatypes);
    this.resource$ = this.currentSynchronized$;
  }

  change(resource: IResource) {
    this.editorChange(
      resource,
      true,
    );
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      flatMap((id) => {
        return this.store.select(selectSegmentStructureById, { id });
      }),
    );
  }

  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.current$).pipe(
      take(1),
      concatMap(([id, current]) => {
        return this.structureEditorService.saveSegmentStructure(id, current.data.children).pipe(
          flatMap((message) => {
            return [this.messageService.messageToAction(message), new LoadResourceReferences({ resourceType: this.editor.resourceType, id }), new fromDam.EditorUpdate({ value: current.data, updateDate: false }), new fromDam.SetValue({ selected: current.data })];
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  ngOnDestroy(): void {
    this.workspace_s.unsubscribe();
  }

  onDeactivate(): void {
  }

  ngOnInit() {
  }

}
