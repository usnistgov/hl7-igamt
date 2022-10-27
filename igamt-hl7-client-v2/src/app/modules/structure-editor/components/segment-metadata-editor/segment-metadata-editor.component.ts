import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Actions} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {combineLatest, Observable, Subscription, throwError} from 'rxjs';
import {catchError, concatMap, flatMap, map, take, tap, withLatestFrom} from 'rxjs/operators';
import {MessageService} from 'src/app/modules/dam-framework/services/message.service';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { validateStructureConvention } from 'src/app/modules/shared/functions/convention-factory';
import {
  selectSegmentStructureById,
  selectSegmentStructures,
} from '../../../../root-store/structure-editor/structure-editor.reducer';
import {Scope} from '../../../shared/constants/scope.enum';
import {Type} from '../../../shared/constants/type.enum';
import { validateStructureUnicity} from '../../../shared/functions/unicity-factory';
import {IDisplayElement} from '../../../shared/models/display-element.interface';
import {EditorID} from '../../../shared/models/editor.enum';
import {StructureEditorComponent} from '../../services/structure-editor-component.abstract';
import {StructureEditorService} from '../../services/structure-editor.service';
import { LoadUserStructures } from './../../../../root-store/structure-editor/structure-editor.actions';

export interface ISegmentStructureMetadata {
  name: string;
  identifier: string;
  description: string;
  hl7Version: string;
}

@Component({
  selector: 'app-segment-metadata-editor',
  templateUrl: './segment-metadata-editor.component.html',
  styleUrls: ['./segment-metadata-editor.component.scss'],
})
export class SegmentMetadataEditorComponent extends StructureEditorComponent implements OnInit, OnDestroy {

  s_workspace: Subscription;
  formGroup: FormGroup;
  isZSegment: Observable<boolean>;

  constructor(
    actions$: Actions,
    protected formBuilder: FormBuilder,
    private structureEditorService: StructureEditorService,
    private messageService: MessageService,
    store: Store<any>,
  ) {
    super({
      id: EditorID.CUSTOM_SEGMENT_STRUC_METADATA,
      title: 'Metadata',
      resourceType: Type.SEGMENT,
    }, actions$, store);
    this.isZSegment = this.initial$.pipe(
      map((x) => x.name.startsWith('Z')),
    );
    this.s_workspace = this.currentSynchronized$.pipe(
      withLatestFrom(this.getOthers()),

      tap(([metadata, others]) => {
        this.initFormGroup(others, metadata.name, metadata.hl7Version);
        this.formGroup.patchValue(metadata);
        this.formGroup.valueChanges.subscribe((changed) => {
          this.editorChange(changed, this.formGroup.valid);
        });
      }),
    ).subscribe();
  }

  initFormGroup(others: IDisplayElement[], name: string, version: string) {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.pattern('Z[A-Z0-9]{2}'),  Validators.required]],
      identifier: ['', [ validateStructureUnicity(others, name, { version, scope: Scope.USERCUSTOM} ), Validators.required]],
      description: [''],
      hl7Version: [''],
    });
  }

  getOthers(): Observable<IDisplayElement[]> {
    return  this.store.select(selectSegmentStructures).pipe(
      take(1),
      withLatestFrom(this.elementId$),
      map(([exiting, id]) => {
        return exiting.filter((x) => x.id !== id);
      }),
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
        return this.structureEditorService.saveSegmentMetadata(id, current.data).pipe(
          flatMap((message) => {
            return [this.messageService.messageToAction(message), new fromDam.EditorUpdate({ value: current.data, updateDate: false }), new fromDam.SetValue({ selected: current.data }), new LoadUserStructures()];
          }),
          catchError((error) => throwError(this.messageService.actionFromError(error))),
        );
      }),
    );
  }

  ngOnDestroy(): void {
    this.s_workspace.unsubscribe();
  }

  onDeactivate(): void {
  }

  ngOnInit() {
  }

}
