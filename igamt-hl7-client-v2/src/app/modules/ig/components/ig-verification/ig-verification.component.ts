import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AbstractEditorComponent } from 'src/app/modules/core/components/abstract-editor-component/abstract-editor-component.component';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { IVerificationResultDisplay, VerificationDisplayActiveTypeSelector } from 'src/app/modules/shared/components/verification-result-display/verification-result-display.component';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { selectVerificationResult, selectVerificationStatus } from './../../../../root-store/dam-igamt/igamt.selected-resource.selectors';
import { IDisplayElement } from './../../../shared/models/display-element.interface';
import { EditorID } from './../../../shared/models/editor.enum';
import { StoreResourceRepositoryService } from './../../../shared/services/resource-repository.service';
import { VerificationService } from './../../../shared/services/verification.service';
import { IgDocument } from './../../models/ig/ig-document.class';
import { IgService } from './../../services/ig.service';

@Component({
  selector: 'app-ig-verification',
  templateUrl: './ig-verification.component.html',
  styleUrls: ['./ig-verification.component.scss'],
})
export class IgVerificationComponent extends AbstractEditorComponent implements OnInit {
  status$: Observable<{ loading: boolean, failed: boolean, failure: string }>;
  verificationResult$: Observable<IVerificationResultDisplay>;
  activeSelector: VerificationDisplayActiveTypeSelector = () => {
    return Type.IGDOCUMENT;
  }

  constructor(
    store: Store<any>,
    actions$: Actions,
    private igService: IgService,
    public repository: StoreResourceRepositoryService, private verificationService: VerificationService) {
    super(
      {
        id: EditorID.IG_VERIFICATION,
        title: 'IG Verification',
        resourceType: Type.IGDOCUMENT,
      },
      actions$,
      store,
    );

    this.verificationResult$ = this.store.select(selectVerificationResult).pipe(
      switchMap((value) => {
        return this.verificationService.verificationReportToDisplay(value, repository);
      }),
    );
    this.status$ = this.store.select(selectVerificationStatus);
  }

  onEditorSave(action: fromDAM.EditorSave): Observable<Action> {
    throw new Error('Method not implemented.');
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.document$.pipe(
      map((document) => {
        return this.igService.igToIDisplayElement(document as IgDocument);
      }),
    );
  }

  onDeactivate(): void {
  }

  ngOnInit() {
  }

}
export interface IVerificationReport {
  igVerificationResult?: any;
  segmentVerificationResults?: any;
  conformanceProfileVerificationResults?: any;
  datatypeVerificationResults?: any;
  valuesetVerificationResults?: any;
}
export interface IVerificationReport {
  ig?: any;
  segment?: any;
  message?: any;
  datatype?: any;
  valueset?: any;
}
