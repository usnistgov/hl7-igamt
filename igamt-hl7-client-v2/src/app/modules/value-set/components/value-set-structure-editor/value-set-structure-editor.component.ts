import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Actions} from '@ngrx/effects';
import {Action, MemoizedSelectorWithProps, Store} from '@ngrx/store';
import {SelectItem} from 'primeng/api';
import {combineLatest, concat, Observable, of, ReplaySubject, Subscription, throwError} from 'rxjs';
import {catchError, concatMap, flatMap, map, mergeMap, take, tap, withLatestFrom} from 'rxjs/operators';
import * as fromIgamtDisplaySelectors from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';
import * as fromIgamtSelectedSelectors from 'src/app/root-store/dam-igamt/igamt.selected-resource.selectors';
import {getHl7ConfigState} from '../../../../root-store/config/config.reducer';
import {selectDerived} from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import {AbstractEditorComponent} from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import {Message} from '../../../dam-framework/models/messages/message.class';
import {MessageService} from '../../../dam-framework/services/message.service';
import * as fromDam from '../../../dam-framework/store';
import * as fromAuth from '../../../dam-framework/store/authentication';
import {Type} from '../../../shared/constants/type.enum';
import {IDocumentRef} from '../../../shared/models/abstract-domain.interface';
import {SourceType} from '../../../shared/models/adding-info';
import {Hl7Config} from '../../../shared/models/config.class';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {EditorID} from '../../../shared/models/editor.enum';
import {ChangeType, IChange, IChangeReason, PropertyType} from '../../../shared/models/save-change';
import {IValueSet} from '../../../shared/models/value-set.interface';
import {StoreResourceRepositoryService} from '../../../shared/services/resource-repository.service';
import {ValueSetService} from '../../service/value-set.service';
import {ReasonForChangeDialogComponent} from '../reason-for-change-dialog/reason-for-change-dialog.component';

@Component({
  selector: 'app-value-set-structure-editor',
  templateUrl: './value-set-structure-editor.component.html',
  styleUrls: ['./value-set-structure-editor.component.css'],
})
export class ValueSetStructureEditorComponent extends AbstractEditorComponent implements OnDestroy, OnInit {

  selectedColumns: any[] = [];
  cols: any[] = [];
  codeSystemOptions: any[];
  hasOrigin$: Observable<boolean>;
  enforceChangeReason = true;
  type = Type;
  resourceSubject: ReplaySubject<IValueSet>;
  public config: Observable<Hl7Config>;
  changes: ReplaySubject<IRootChanges>;
  username: Observable<string>;
  resource$: Observable<IValueSet>;
  workspace_s: Subscription;
  resourceType: Type;
  derived$: Observable<boolean>;

  constructor(
    readonly repository: StoreResourceRepositoryService,
    private valueSetService: ValueSetService,
    private messageService: MessageService,
    actions$: Actions,
    private dialog: MatDialog,
    store: Store<any>) {
    super(     {
      id: EditorID.VALUESET_STRUCTURE,
      title: 'Structure',
      resourceType: Type.VALUESET,
    }, actions$, store);
    this.resourceType = Type.VALUESET;
    this.hasOrigin$ = this.store.select(fromIgamtSelectedSelectors.selectedResourceHasOrigin);
    this.config = this.store.select(getHl7ConfigState);
    this.username = this.store.select(fromAuth.selectUsername);
    this.resourceSubject = new ReplaySubject<IValueSet>(1);
    this.changes = new ReplaySubject<IRootChanges>(1);
    this.derived$ = combineLatest(this.store.select(selectDerived), this.hasOrigin$).pipe(
      map(([derivedIg, elmHadOrigin]) => {
        return derivedIg && elmHadOrigin;
      }),
    );
    this.workspace_s = this.currentSynchronized$.pipe(
      map((current) => {
        this.resourceSubject.next({ ...current.resource });
        this.changes.next({ ...current.changes });
      }),
    ).subscribe();
    this.resource$ = this.resourceSubject.asObservable();
    this.hasOrigin$ = this.store.select(fromIgamtSelectedSelectors.selectedResourceHasOrigin);
    this.resource$.subscribe((resource: IValueSet) => {
      this.cols = [];
      this.cols.push({ field: 'value', header: 'Value' });
      this.cols.push({ field: 'pattern', header: 'Pattern' });
      this.cols.push({ field: 'description', header: 'Description' });
      this.cols.push({ field: 'codeSystem', header: 'Code System' });
      if (resource.sourceType !== SourceType.EXTERNAL) {
        this.cols.push({ field: 'usage', header: 'Usage' });
      }
      this.cols.push({ field: 'comments', header: 'Comments' });
      this.selectedColumns = this.cols;
      this.codeSystemOptions = this.getCodeSystemOptions(resource);
    });

    this.changes.asObservable().subscribe((x) => console.log(x));
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

  saveChanges(id: string, documentRef: IDocumentRef, changes: IChange[]): Observable<Message<string>> {
    return this.valueSetService.saveChanges(id, documentRef, changes);
  }

  getById(id: string): Observable<IValueSet> {
    return this.documentRef$.pipe(
      take(1),
      mergeMap((x) => {
        return this.valueSetService.getById(x, id);
      }),
    );
  }

  elementSelector(): MemoizedSelectorWithProps<object, { id: string; }, IDisplayElement> {
    return fromIgamtDisplaySelectors.selectValueSetById;
  }

  editorChange(data: any, valid: boolean) {
    this.changeTime = new Date();
    this.store.dispatch(new fromDam.EditorChange({
      data,
      valid,
      date: this.changeTime,
    }));
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  onDeactivate(): void {
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.elementId$.pipe(
      concatMap((id) => {
        return this.store.select(this.elementSelector(), { id });
      }),
    );
  }
  change(change: IChange) {
    this.getChange(change, false).pipe(
      mergeMap((ch) => {
        console.log(ch);
        return combineLatest(this.changes, this.resource$).pipe(
          take(1),
            tap(([changes, resource]) => {
              const newchanges = {...changes};
              newchanges[ch.propertyType] = ch;
              this.resourceSubject.next(resource);
              this.changes.next(newchanges);
              this.editorChange({changes: newchanges, resource}, true);
            }),
          );
        },
      )).subscribe();
  }
  getChange( change: IChange, skipReason: boolean = false): Observable<IChange> {
    return this.derived$.pipe(
      take(1),
      mergeMap((x) => {if (x) {
      return concat(of(change), this.getChangeReasonForPropertyChange(change, false));
    } else {
        return of(change);
    }}),
    );
  }

  getChangeReasonForPropertyChange(change: IChange, skipReason: boolean = false): Observable<IChange> {
    if (this.enforceChangeReason && !skipReason && this.isActualChange(change)) {
      return this.openReasonsDialog();
    } else {
      return of();
    }
  }
  createReasonForChange(reasons: IChangeReason[]): IChange {
    return {
      location: '0',
      propertyType: PropertyType.CHANGEREASON,
      propertyValue: reasons,
      oldPropertyValue: null,
      position: 0,
      changeType: ChangeType.UPDATE,
    };
  }
  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.documentRef$, this.changes.asObservable()).pipe(
      take(1),
      mergeMap(([id, documentRef, changes]) => {
        console.log(changes);
        return this.saveChanges(id, documentRef, Object.values(changes)).pipe(
          mergeMap((message) => {
            return this.getById(id).pipe(
              take(1),
              flatMap((resource) => {
                this.changes.next({});
                this.resourceSubject.next(resource);
                return [this.messageService.messageToAction(message), new fromDam.EditorUpdate({ value: { changes: {} , resource }, updateDate: false }), new fromDam.SetValue({ selected: resource })];
              }),
            );
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  private isActualChange(change: IChange) {
   return  change.propertyType !== PropertyType.CHANGEREASON;
  }

  viewReasons() {
    this.openReasonsDialog().subscribe();
  }

  openReasonsDialog(): Observable<IChange> {
    return combineLatest(this.resource$, this.changes.asObservable(), this.viewOnly$).pipe(
      take(1),
      mergeMap(([vs, changes, viewOnly]) => {
        return this.dialog.open(ReasonForChangeDialogComponent, {
          data: {
            existing: vs.changeLogs ?  vs.changeLogs : [],
            viewOnly,
          },
        }).afterClosed().pipe(
          take(1),
          map((changeReason) => {
            vs.changeLogs = changeReason;
            this.resourceSubject.next(vs);
            return this.createReasonForChange(changeReason);
          }));
      }),
    );
  }
}

export interface IRootChanges {
    [property: string]: IChange;
}
