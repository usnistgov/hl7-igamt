import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/modules/dam-framework/components/fragments/confirm-dialog/confirm-dialog.component';
import { UsageDialogComponent } from 'src/app/modules/shared/components/usage-dialog/usage-dialog.component';
import { selectWorkspaceActive } from '../../../../root-store/dam-igamt/igamt.selectors';
import { selectMessageStructures, selectSegmentStructures } from '../../../../root-store/structure-editor/structure-editor.reducer';
import { IMessage } from '../../../dam-framework/models/messages/message.class';
import { MessageService } from '../../../dam-framework/services/message.service';
import { DeleteResourcesFromRepostory, InsertResourcesInRepostory } from '../../../dam-framework/store/data/dam.actions';
import { Type } from '../../../shared/constants/type.enum';
import { IUsages } from '../../../shared/models/cross-reference';
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
  readonly SEGMENTS_REPO = 'segment-structures';
  readonly MESSAGES_REPO = 'message-structures';

  constructor(
    private store: Store<any>,
    private router: Router,
    private dialog: MatDialog,
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
            id: Type.CONFORMANCEPROFILEREGISTRY,
            children: messageStructures || [],
          },
          {
            type: Type.SEGMENTREGISTRY,
            isExpanded: true,
            id: Type.SEGMENTREGISTRY,
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
    const { repository, publish } = type === Type.SEGMENT ?
      {
        repository: this.SEGMENTS_REPO,
        publish: this.structureEditorService.publishSegment(id) as Observable<IMessage<any>>,
      } :
      {
        repository: this.MESSAGES_REPO,
        publish: this.structureEditorService.publishMessageStructure(id) as Observable<IMessage<any>>,
      };

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

  deleteMessageStructure(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        question: 'Are you sure you want to delete this message structure ?',
        action: 'Delete Message Structure',
      },
    });
    dialogRef.afterClosed().pipe(
      map((answer) => {
        if (answer) {
          this.structureEditorService.deleteMessageStructure(id).pipe(
            map((response) => {
              this.store.dispatch(this.messageService.messageToAction(response));
              this.conditionalRedirectHome(id);
              this.store.dispatch(new DeleteResourcesFromRepostory({
                collections: [{
                  key: this.MESSAGES_REPO,
                  values: [id],
                }],
              }));
            }),
            catchError((err) => {
              this.store.dispatch(this.messageService.actionFromError(err));
              return throwError(err);
            }),
          ).subscribe();
        }
      }),
    ).subscribe();
  }

  deleteSegmentStructure(id: string) {
    this.structureEditorService.getSegmentCrossRefs(id).pipe(
      take(1),
      map((usages: IUsages[]) => {
        if (usages.length === 0) {
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
              question: 'Are you sure you want to delete this segment structure ?',
              action: 'Delete Segment Structure',
            },
          });
          dialogRef.afterClosed().subscribe(
            (answer) => {
              if (answer) {
                this.structureEditorService.deleteSegmentStructure(id).pipe(
                  map((response) => {
                    this.store.dispatch(this.messageService.messageToAction(response));
                    this.conditionalRedirectHome(id);
                    this.store.dispatch(new DeleteResourcesFromRepostory({
                      collections: [{
                        key: this.SEGMENTS_REPO,
                        values: [id],
                      }],
                    }));
                  }),
                  catchError((err) => {
                    this.store.dispatch(this.messageService.actionFromError(err));
                    return throwError(err);
                  }),
                ).subscribe();
              }
            },
          );
        } else {
          this.dialog.open(UsageDialogComponent, {
            data: {
              title: 'Cross References found',
              usages,
              element: {},
            },
          });
        }
      }),
    ).subscribe();
  }

  conditionalRedirectHome(id: string) {
    this.store.select(selectWorkspaceActive).pipe(
      take(1),
      map((active) => {
        if (active.display.id === id) {
          this.router.navigate(['/', 'structure-editor']);
        }
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
