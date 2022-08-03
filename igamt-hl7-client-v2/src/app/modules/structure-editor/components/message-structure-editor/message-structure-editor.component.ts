import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { combineLatest, Observable, of, Subscription, throwError } from 'rxjs';
import { catchError, concatMap, flatMap, map, switchMap, take } from 'rxjs/operators';
import * as fromAuth from 'src/app/modules/dam-framework/store/authentication/index';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { getHl7ConfigState, selectBindingConfig } from '../../../../root-store/config/config.reducer';
import { selectMessageStructureById } from '../../../../root-store/structure-editor/structure-editor.reducer';
import { MessageService } from '../../../dam-framework/services/message.service';
import { HL7v2TreeColumnType } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../shared/constants/type.enum';
import { Hl7Config, IValueSetBindingConfigMap } from '../../../shared/models/config.class';
import { IMessageStructure } from '../../../shared/models/conformance-profile.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { IResource } from '../../../shared/models/resource.interface';
import { StructureEditorComponent } from '../../services/structure-editor-component.abstract';
import { StructureEditorResourceRepositoryService } from '../../services/structure-editor-resource-repository.service';
import { StructureEditorService } from '../../services/structure-editor.service';

@Component({
  selector: 'app-message-structure-editor',
  templateUrl: './message-structure-editor.component.html',
  styleUrls: ['./message-structure-editor.component.scss'],
})
export class MessageStructureEditorComponent extends StructureEditorComponent implements OnInit {

  type = Type;
  public bindingConfig: Observable<IValueSetBindingConfigMap>;
  public config: Observable<Hl7Config>;
  username: Observable<string>;
  resource$: Observable<IMessageStructure>;
  columns: HL7v2TreeColumnType[];
  public datatypes: Observable<IDisplayElement[]>;
  public segments: Observable<IDisplayElement[]>;

  constructor(
    actions$: Actions,
    store: Store<any>,
    private structureEditorService: StructureEditorService,
    private messageService: MessageService,
    public repository: StructureEditorResourceRepositoryService,
  ) {
    super({
      id: EditorID.CONFP_CUSTOM_STRUCTURE,
      title: 'Structure',
      resourceType: Type.MESSAGESTRUCT,
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
    this.segments = this.store.select(fromIgamtDisplaySelectors.selectAllSegments);
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
      switchMap((id) => {
        return this.store.select(selectMessageStructureById, { id });
      }),
    );
  }

  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.current$).pipe(
      take(1),
      concatMap(([id, current]) => {
        return this.structureEditorService.saveMessageStructure(id, current.data.children).pipe(
          flatMap((message) => {
            return [this.messageService.messageToAction(message), new fromDam.EditorUpdate({ value: current.data, updateDate: false }), new fromDam.SetValue({ selected: current.data })];
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  onDeactivate(): void {
  }

  ngOnInit() {
  }

}
