import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectMessageStructures, selectSegmentStructures } from '../../../../root-store/structure-editor/structure-editor.reducer';
import { IMessage } from '../../../dam-framework/models/messages/message.class';
import { MessageService } from '../../../dam-framework/services/message.service';
import { InsertResourcesInRepostory } from '../../../dam-framework/store/data/dam.actions';
import { Type } from '../../../shared/constants/type.enum';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { StructureEditorService } from '../../services/structure-editor.service';
import { TableOfContentComponent } from '../table-of-content/table-of-content.component';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {

  nodes: Observable<Array<Partial<IDisplayElement>>>;
  @ViewChild(TableOfContentComponent) toc: TableOfContentComponent;

  constructor(
    private store: Store<any>,
    private structureEditorService: StructureEditorService,
    private messageService: MessageService,
  ) {
    this.nodes = combineLatest(
      this.store.select(selectMessageStructures),
      this.store.select(selectSegmentStructures),
    ).pipe(
      map(([messageStructures, segmentStructures]) => {
        return [
          {
            type: Type.CONFORMANCEPROFILEREGISTRY,
            isExpanded: true,
            children: messageStructures || [],
          },
          {
            type: Type.SEGMENTREGISTRY,
            isExpanded: true,
            children: segmentStructures || [],
          },
        ];
      }),
    );
  }

  scrollTo(type) {
    this.toc.scroll(type);
  }

  filterFn(value: any) {
    this.toc.filter(value);
  }

  collapseAll() {
    this.toc.collapseAll();
  }

  expandAll() {
    this.toc.expandAll();
  }

  publish({ id, type }) {
    const repository = type === Type.SEGMENT ? 'segment-structures' : 'message-structures';
    const publish: Observable<IMessage<any>> = (Type.SEGMENT ? this.structureEditorService.publishSegment(id) : this.structureEditorService.publishMessageStructure(id));

    publish.pipe(
      map((response) => {
        this.store.dispatch(this.messageService.messageToAction(response));
        this.store.dispatch(new InsertResourcesInRepostory({
          collections: [{
            key: repository,
            values: [response.data.displayElement],
          }],
        }));
      }),
    ).subscribe();
  }

  createMessage($event) {
    this.structureEditorService.createMessageStructure($event).pipe(
      map((message) => {
        this.store.dispatch(new InsertResourcesInRepostory({
          collections: [{
            key: 'message-structures',
            values: [message.displayElement],
          }],
        }));
      }),
    ).subscribe();
  }

  createSegment($event) {
    this.structureEditorService.createSegmentStructure($event).pipe(
      map((segment) => {
        this.store.dispatch(new InsertResourcesInRepostory({
          collections: [{
            key: 'segment-structures',
            values: [segment.displayElement],
          }],
        }));
      }),
    ).subscribe();
  }

  ngOnInit() {
  }

}
