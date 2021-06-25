import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of, ReplaySubject, Subscription } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { AbstractEditorComponent } from 'src/app/modules/core/components/abstract-editor-component/abstract-editor-component.component';
import { BindingLegend } from 'src/app/modules/core/components/structure-editor/structure-editor.component';
import { Message } from 'src/app/modules/dam-framework/models/messages/message.class';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { EditorSave } from 'src/app/modules/dam-framework/store';
import { selectUsername } from 'src/app/modules/dam-framework/store/authentication';
import { HL7v2TreeColumnType } from 'src/app/modules/shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { IDocumentRef } from 'src/app/modules/shared/models/abstract-domain.interface';
import { ICompositeProfileState, IResourceAndDisplay } from 'src/app/modules/shared/models/composite-profile';
import { Hl7Config, IValueSetBindingConfigMap } from 'src/app/modules/shared/models/config.class';
import { ConstraintType } from 'src/app/modules/shared/models/cs.interface';
import { IDisplayElement } from 'src/app/modules/shared/models/display-element.interface';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { IChange } from 'src/app/modules/shared/models/save-change';
import { StoreResourceRepositoryService } from 'src/app/modules/shared/services/resource-repository.service';
import { getHl7ConfigState, selectBindingConfig } from 'src/app/root-store/config/config.reducer';
import { selectAllDatatypes, selectAllSegments, selectCompositeProfileById } from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { selectValueSetsNodes } from 'src/app/root-store/ig/ig-edit/ig-edit.index';

export type GroupOptions = Array<{
  label: string,
  items: Array<{
    label: string,
    value: IResourceAndDisplay<any>,
  }>,
}>;

export enum GeneratedFlavorTabs {
  STRUCTURE = 'Structure',
  CONFORMANCE_STATEMENTS = 'Conformance Statements',
  DYNAMIC_MAPPING = 'Dynamic Mapping',
  COCONSTRAINTS = 'Co-Constraints',
}

@Component({
  selector: 'app-structure-editor',
  templateUrl: './structure-editor.component.html',
  styleUrls: ['./structure-editor.component.scss'],
})
export class StructureEditorComponent extends AbstractEditorComponent implements OnInit, OnDestroy {
  type = Type;
  TABS = GeneratedFlavorTabs;
  resourceSubject: ReplaySubject<GroupOptions>;
  public datatypes: Observable<IDisplayElement[]>;
  public segments: Observable<IDisplayElement[]>;
  public valueSets: Observable<IDisplayElement[]>;
  public bindingConfig: Observable<IValueSetBindingConfigMap>;
  public config: Observable<Hl7Config>;
  username: Observable<string>;
  resource$: Observable<GroupOptions>;
  workspace_s: Subscription;
  resourceType: Type;
  legend: BindingLegend;
  columns: HL7v2TreeColumnType[];
  selected: IResourceAndDisplay<any>;
  activeTab: GeneratedFlavorTabs;
  tabs: GeneratedFlavorTabs[] = [];

  constructor(
    readonly repository: StoreResourceRepositoryService,
    private messageService: MessageService,
    actions$: Actions,
    store: Store<any>,
  ) {
    super({
      id: EditorID.COMPOSITE_PROFILE_STRUCTURE,
      title: 'Structure',
      resourceType: Type.COMPOSITEPROFILE,
    }, actions$, store);
    this.legend = [
      {
        context: {
          resource: Type.CONFORMANCEPROFILE,
        },
        label: 'Conformance Profile',
      },
      {
        context: {
          resource: Type.SEGMENT,
        },
        label: 'Segment',
      },
      {
        context: {
          resource: Type.DATATYPE,
          element: Type.FIELD,
        },
        label: 'Datatype (FIELD)',
      },
      {
        context: {
          resource: Type.DATATYPE,
          element: Type.COMPONENT,
        },
        label: 'Datatype (COMPONENT)',
      },
    ];
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
    this.resourceType = Type.CONFORMANCEPROFILE;
    this.config = this.store.select(getHl7ConfigState);
    this.datatypes = this.store.select(selectAllDatatypes);
    this.segments = this.store.select(selectAllSegments);
    this.valueSets = this.store.select(selectValueSetsNodes);
    this.username = this.store.select(selectUsername);
    this.bindingConfig = this.store.select(selectBindingConfig);
    this.bindingConfig.subscribe();

    this.resourceSubject = new ReplaySubject<GroupOptions>(1);

    this.workspace_s = this.currentSynchronized$.pipe(
      map((current: ICompositeProfileState) => {
        const confP = current.conformanceProfile ? {
          label: 'Conformance Profile',
          items: [{
            label: current.conformanceProfile.display.variableName,
            value: current.conformanceProfile,
          }],
        } : undefined;
        const datatypes = current.datatypes && current.datatypes.length > 0 ? {
          label: 'Datatypes',
          items: current.datatypes.map((dt) => ({
            label: dt.display.fixedName,
            value: dt,
          })),
        } : undefined;
        const segments = current.segments && current.segments.length > 0 ? {
          label: 'Segments',
          items: current.segments.map((sg) => ({
            label: sg.display.fixedName,
            value: sg,
          })),
        } : undefined;
        this.selected = confP.items[0].value;
        this.selectItem(confP.items[0].value);
        this.resourceSubject.next([
          ...(confP ? [confP] : []),
          ...(segments ? [segments] : []),
          ...(datatypes ? [datatypes] : []),
        ]);
      }),
    ).subscribe();

    this.resource$ = this.resourceSubject.asObservable();
  }

  saveChanges(id: string, documentRef: IDocumentRef, changes: IChange[]): Observable<Message<any>> {
    return of();
  }

  getDescription(cs) {
    if (cs.type === ConstraintType.ASSERTION) {
      return cs.assertion.description;
    } else {
      return cs.freeText;
    }
  }

  ngOnInit(): void {
  }

  selectItem(elm: IResourceAndDisplay<any>) {
    switch (elm.display.type) {
      case Type.DATATYPE:
      case Type.SEGMENT:
        this.tabs = [GeneratedFlavorTabs.STRUCTURE, GeneratedFlavorTabs.CONFORMANCE_STATEMENTS ];
        if (elm.resource.name === 'OBX') {
          this.tabs.push(GeneratedFlavorTabs.DYNAMIC_MAPPING);
        }
        break;
      case Type.CONFORMANCEPROFILE:
        this.tabs = [GeneratedFlavorTabs.STRUCTURE, GeneratedFlavorTabs.CONFORMANCE_STATEMENTS, GeneratedFlavorTabs.COCONSTRAINTS];
        break;
    }
    if (!this.tabs.includes(this.activeTab)) {
      this.activeTab = GeneratedFlavorTabs.STRUCTURE;
    }
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      concatMap((id) => {
        return this.store.select(selectCompositeProfileById, { id });
      }),
    );
  }
  onEditorSave(action: EditorSave): Observable<Action> {
    throw new Error('Method not implemented.');
  }
  onDeactivate(): void {

  }
  ngOnDestroy() {
    this.workspace_s.unsubscribe();
  }

}
