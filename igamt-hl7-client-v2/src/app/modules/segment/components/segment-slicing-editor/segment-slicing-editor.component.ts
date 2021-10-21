import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Actions} from '@ngrx/effects';
import {Action, MemoizedSelector, Store} from '@ngrx/store';
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {filter, flatMap, map, take, tap} from 'rxjs/operators';
import {selectSelectedResource} from '../../../../root-store/dam-igamt/igamt.selected-resource.selectors';
import {AbstractEditorComponent} from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import {
  IConformanceStatementEditorData, IDependantConformanceStatements,
  IEditableConformanceStatementGroup
} from '../../../core/components/conformance-statement-editor/conformance-statement-editor.component';
import {MessageService} from '../../../dam-framework/services/message.service';
import {EditorSave} from '../../../dam-framework/store/data';
import {IHL7v2TreeNode} from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import {IStructureTreeSelect} from '../../../shared/components/structure-tree/structure-tree.component';
import {Type} from '../../../shared/constants/type.enum';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {EditorID, IHL7EditorMetadata} from '../../../shared/models/editor.enum';
import {IResource} from '../../../shared/models/resource.interface';
import {ConformanceStatementService} from '../../../shared/services/conformance-statement.service';
import {Hl7V2TreeService} from '../../../shared/services/hl7-v2-tree.service';
import {StoreResourceRepositoryService} from '../../../shared/services/resource-repository.service';
import {SlicingService} from '../../../shared/services/slicing.service';
import {IHL7v2TreeFilter, RestrictionType} from '../../../shared/services/tree-filter.service';

@Component({
  selector: 'app-segment-slicing-editor',
  templateUrl: './segment-slicing-editor.component.html',
  styleUrls: ['./segment-slicing-editor.component.css'],
})
export class SegmentSlicingEditorComponent extends AbstractEditorComponent implements OnInit, OnDestroy {

  selectedResource$: Observable<IResource>;
  s_workspace: Subscription;
  tree_s: Subscription;
  resourceType: Type;
  derived$: Observable<boolean>;
  resource$: Observable<IResource>;
  nodes: IHL7v2TreeNode[];
  segmentTreeFilter: IHL7v2TreeFilter = {
    hide: false,
    restrictions: [
      {
        criterion: RestrictionType.TYPE,
        allow: true,
        value: [Type.FIELD],
      },
    ],
  };;
  constructor(
    readonly repository: StoreResourceRepositoryService,
    private messageService: MessageService,
    private conformanceStatementService: SlicingService,
    public hl7V2TreeService: Hl7V2TreeService,

    dialog: MatDialog,
    actions$: Actions,
    store: Store<any>) {
    super(    {
      id: EditorID.SEGMENT_SLICING,
      title: 'Slicing',
      resourceType: Type.SEGMENT,
    }, actions$, store);
    this.selectedResource$ = this.store.select(selectSelectedResource);
    this.s_workspace = this.currentSynchronized$.pipe(
      map((data: any) => {
      }),
    ).subscribe();
    this.selectedResource$.pipe(tap((resource) => {
        this.tree_s = this.hl7V2TreeService.getTree(resource, this.repository, true, true, (value) => {
          this.nodes = [
            {
              data: {
                id: resource.id,
                pathId: resource.id,
                name: resource.name,
                type: resource.type,
                rootPath: {elementId: resource.id},
                position: 0,
              },
              children: [...value],
              parent: undefined,
              expanded: true,
            },
          ];
        });
      },
    )).subscribe();
  }
  ngOnInit() {
  }

  editorDisplayNode(): Observable<IDisplayElement>;
  editorDisplayNode(): Observable<any>;
  editorDisplayNode(): Observable<IDisplayElement> | Observable<any> {
    return undefined;
  }

  ngOnDestroy(): void {
  }

  onDeactivate(): void {
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return undefined;
  }

  selectSegment($event: IStructureTreeSelect) {
    console.log($event);
  }
}
