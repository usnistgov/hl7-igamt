import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import { EntityDeltaEditorComponent, EntityDeltaNavigationPills } from '../../../core/components/entity-delta-editor/entity-delta-editor.component';
import { HL7v2TreeColumnType, IHL7v2TreeNode } from '../../../shared/components/hl7-v2-tree/hl7-v2-tree.component';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { Hl7V2TreeService } from '../../../shared/services/hl7-v2-tree.service';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';

@Component({
  selector: 'app-delta-editor',
  templateUrl: 'entity-delta-editor.component.html',
  styleUrls: ['../../../core/components/entity-delta-editor/entity-delta-editor.component.scss'],
})
export class DeltaEditorComponent extends EntityDeltaEditorComponent implements OnInit, OnDestroy {

  s_tree: Subscription;
  structure: IHL7v2TreeNode[];

  constructor(
    protected actions$: Actions,
    private treeService: Hl7V2TreeService,
    private repository: StoreResourceRepositoryService,
    protected store: Store<any>) {
    super(
      {
        id: EditorID.CONFP_DELTA,
        title: 'Delta',
        resourceType: Type.CONFORMANCEPROFILE,
      },
      actions$,
      store,
      [
        EntityDeltaNavigationPills.STRUCTURE,
        EntityDeltaNavigationPills.CONFORMANCE_STATEMENTS,
        EntityDeltaNavigationPills.COCONSTRAINTS,
      ],
      [
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
      ],
    );
    this.resource.pipe(
      take(1),
      tap((resource) => {
        this.s_tree = this.treeService.getTree(resource, this.repository, true, true, (value) => {
          this.structure = [
            {
              data: {
                id: resource.id,
                pathId: resource.id,
                name: resource.name,
                type: resource.type,
                rootPath: { elementId: resource.id },
                position: 0,
              },
              expanded: true,
              children: [...value],
              parent: undefined,
            },
          ];
        });
      }),
    ).subscribe();

  }

  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return fromIgamtDisplaySelectors.selectMessagesById;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.s_tree) {
      this.s_tree.unsubscribe();
    }
  }

}
