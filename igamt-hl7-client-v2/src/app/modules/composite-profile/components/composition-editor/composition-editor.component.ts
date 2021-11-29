import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { TreeNode } from 'primeng/api';
import { combineLatest, from, Observable, ReplaySubject, Subscription, throwError } from 'rxjs';
import { catchError, filter, flatMap, map, mergeMap, switchMap, take, tap, toArray } from 'rxjs/operators';
import { AddPcToList } from 'src/app/modules/shared/components/pc-list/add-profile-component/add-pc-to-list.component';
import { selectProfileComponentById } from '../../../../root-store/dam-igamt/igamt.resource-display.selectors';
import * as fromIgamtDisplaySelectors from '../../../../root-store/dam-igamt/igamt.resource-display.selectors';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { Message, MessageType } from '../../../dam-framework/models/messages/message.class';
import { MessageService } from '../../../dam-framework/services/message.service';
import * as fromDam from '../../../dam-framework/store';
import { EditorSave } from '../../../dam-framework/store/data';
import { Type } from '../../../shared/constants/type.enum';
import { ICompositeProfile, IOrderedProfileComponentLink } from '../../../shared/models/composite-profile';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { EditorID } from '../../../shared/models/editor.enum';
import { CompositeProfileService } from '../../services/composite-profile.service';

@Component({
  selector: 'app-composition-editor',
  templateUrl: './composition-editor.component.html',
  styleUrls: ['./composition-editor.component.css'],
})
export class CompositionEditorComponent extends AbstractEditorComponent implements OnInit, OnDestroy {
  coreProfileDisplay$: Observable<IDisplayElement>;
  compositeProfile$: Observable<ICompositeProfile>;
  availablePc$: Observable<IDisplayElement[]>;
  resourceSubject: ReplaySubject<ICompositeProfile>;
  workspace_s: Subscription;
  cpTree$: Observable<TreeNode[]>;
  appliedProfileComponentDisplay$: Observable<IDisplayElement[]>;
  pcNodes$: Observable<TreeNode[]>;
  show: Record<string, boolean> = {};

  constructor(store: Store<any>,
              actions$: Actions,
              private dialog: MatDialog,
              private compositeProfileService: CompositeProfileService,
              private messageService: MessageService) {
    super(
      {
        id: EditorID.COMPOSITE_PROFILE_COMPOSITION,
        resourceType: Type.COMPOSITEPROFILE,
        title: 'Composition',
      },
      actions$,
      store,
    );
    this.availablePc$ = this.store.select(fromIgamtDisplaySelectors.selectAllProfileComponents);

    this.resourceSubject = new ReplaySubject<ICompositeProfile>(1);
    this.workspace_s = this.currentSynchronized$.pipe(
      map((current) => {
        this.resourceSubject.next({ ...current });
      }),
    ).subscribe();

    this.compositeProfile$ = this.resourceSubject.asObservable();

    this.coreProfileDisplay$ = this.compositeProfile$.pipe(
      take(1),
      switchMap((element) => {
        return this.store.select(fromIgamtDisplaySelectors.selectMessagesById, { id: element.conformanceProfileId });
      }),
    );
    this.appliedProfileComponentDisplay$ = combineLatest(this.compositeProfile$, this.availablePc$).pipe(
      map(([composite, pcs]) => {
        return this.compositeProfileService.getApplied(composite, pcs);
      }),
    );
    this.pcNodes$ = this.appliedProfileComponentDisplay$.pipe(
      map((x: IDisplayElement[]) => {
        return x.map((y) => this.compositeProfileService.generateTreeNodeFromDisplay(y));
      }),
    );
  }

  onEditorSave(action: EditorSave): Observable<Action> {
    return this.compositeProfile$.pipe(
      take(1),
      mergeMap((composite) => {
        return this.compositeProfileService.save(composite).pipe(
          flatMap((ret) => {
            this.resourceSubject.next(ret);
            return [this.messageService.messageToAction(new Message<any>(MessageType.SUCCESS, 'Composite profile save success!', null)), new fromDam.EditorUpdate({ value: { changes: {}, resource: ret }, updateDate: false }), new fromDam.SetValue({ selected: ret })];
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  drop(event: CdkDragDrop<TreeNode[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    const positionMap = {};
    event.container.data.forEach((elm, i) => {
      positionMap[elm.data.id] = i;
    });
    this.updatePositions(positionMap);
    const save = this.show[event.previousIndex];
    this.show[event.previousIndex] = this.show[event.currentIndex];
    this.show[event.currentIndex] = save;
  }

  addProfileComponent(index: number) {
    combineLatest([
      this.availablePc$,
      this.pcNodes$,
    ]).pipe(
      take(1),
      flatMap(([available, nodes]) => {
        return this.dialog.open(AddPcToList, {
          data: {
            positon: index,
            available,
            selected: this.getSelectMap(nodes),
          },
        }).afterClosed().pipe(
          filter((x) => x !== undefined),
          tap((pcs: IDisplayElement[]) => {
            this.appendProfileComponents({ index, pcs });
          }),
        );
      }),
    ).subscribe();
  }

  private getSelectMap(pcNodes_: TreeNode[]) {
    const obj = {};
    pcNodes_.forEach((x) => obj[x.data.id] = true);
    return obj;
  }

  toggleShow(i: number) {
    this.show[i] = !this.show[i];
  }

  getAppliedProfileComponentsDisplay(orderedProfileComponents: IOrderedProfileComponentLink[]): Observable<IDisplayElement[]> {
    return from(orderedProfileComponents).pipe(
      mergeMap((cpChild: IOrderedProfileComponentLink) => {
        return this.store.select(selectProfileComponentById, { id: cpChild.profileComponentId });
      }),
      toArray(),
    );
  }

  appendProfileComponents($event: { pcs: IDisplayElement[]; index: number }) {
    this.compositeProfile$.pipe(
      take(1),
      map((composite) => {
        const newComposite: ICompositeProfile = {
          ...composite,
          orderedProfileComponents: [
            ... this.compositeProfileService.addPcs(composite.orderedProfileComponents, $event.pcs, $event.index),
          ],
        };
        this.resourceSubject.next(newComposite);
        this.editorChange(newComposite, true);

      }),
    ).subscribe();
  }

  deleteByPosition(index: number) {
    this.compositeProfile$.pipe(
      take(1),
      map((composite) => {
        const newComposite: ICompositeProfile = {
          ...composite,
          orderedProfileComponents: [
            ...this.compositeProfileService.delete(composite.orderedProfileComponents, index),
          ],
        };
        this.resourceSubject.next(newComposite);
        this.editorChange(newComposite, true);

      }),
    ).subscribe();
  }

  updatePositions($event: { [key: string]: number }) {
    this.compositeProfile$.pipe(
      take(1),
      map((composite) => {
        const newComposite: ICompositeProfile = {
          ...composite,
          orderedProfileComponents: [
            ...this.compositeProfileService.reorder(composite.orderedProfileComponents, $event),
          ],
        };
        this.resourceSubject.next(newComposite);
        this.editorChange(newComposite, true);
      }),
    ).subscribe();
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      switchMap((elementId) => {
        return this.store.select(fromIgamtDisplaySelectors.selectCompositeProfileById, { id: elementId });
      }),
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.workspace_s) {
      this.workspace_s.unsubscribe();
    }
  }

  onDeactivate(): void {
  }
}
