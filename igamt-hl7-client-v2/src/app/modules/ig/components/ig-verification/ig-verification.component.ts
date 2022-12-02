import { selectVerificationStatus, selectVerificationResult } from './../../../../root-store/dam-igamt/igamt.selected-resource.selectors';
import { StatementTarget } from './../../../shared/services/statement.service';
import { IVerificationEnty } from './../../../dam-framework/models/data/workspace';
import { AResourceRepositoryService } from 'src/app/modules/shared/services/resource-repository.service';
import { VerificationService, IVerificationEntryTable } from './../../../shared/services/verification.service';
import { IgDocument } from './../../models/ig/ig-document.class';
import { map, filter, concatMap, mergeMap } from 'rxjs/operators';
import { IDisplayElement } from './../../../shared/models/display-element.interface';
import { EditorID } from './../../../shared/models/editor.enum';
import { StoreResourceRepositoryService } from './../../../shared/services/resource-repository.service';
import { IgService } from './../../services/ig.service';
import { Actions } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { AbstractEditorComponent } from 'src/app/modules/core/components/abstract-editor-component/abstract-editor-component.component';
import { Component, OnInit } from '@angular/core';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-ig-verification',
  templateUrl: './ig-verification.component.html',
  styleUrls: ['./ig-verification.component.scss']
})
export class IgVerificationComponent extends AbstractEditorComponent implements OnInit {
  value$ :Observable<IVerificationEntryTable>;
  igVerificationResult$ :Observable<IVerificationEntryTable>;

  segmentVerificationResults$ :Observable<IVerificationEntryTable>;

  conformanceProfileVerificationResults$ :Observable<IVerificationEntryTable>;

  valuesetVerificationResults$ :Observable<IVerificationEntryTable>;

  datatypeVerificationResults$ :Observable<IVerificationEntryTable>;


  display$ :Observable<IVerificationEntryTable>;

  loading = true;
  type = Type.IGDOCUMENT;

  constructor(
    store: Store<any>,
    actions$: Actions,
    private igService: IgService,
    public repository: StoreResourceRepositoryService, private verificationService:  VerificationService) {
    super(
      {
        id: EditorID.IG_VERIFICATION,
        title: 'IG Verification',
        resourceType: Type.IGDOCUMENT,
      },
      actions$,
      store,
    );
      
    //getVerificationEntryTable(entries: IVerificationEnty[], repository: AResourceRepositoryService): Observable<IVerificationEntryTable> {


    // this.value$  = this.currentSynchronized$.pipe(
    //   concatMap((value) => {
    //     return this.verificationService.convertValue( value.verificationResult, repository);
    //   }),
    // );


    this.valuesetVerificationResults$  = this.store.select(selectVerificationResult).pipe(
      concatMap((value) => {
        return this.verificationService.convertValueByType( value, Type.VALUESET, repository);
      }),
    );

    this.datatypeVerificationResults$ = this.store.select(selectVerificationResult).pipe(
      concatMap((value) => {
        return this.verificationService.convertValueByType( value, Type.DATATYPE, repository);
      }),
    );

    this.segmentVerificationResults$ = this.store.select(selectVerificationResult).pipe(
      concatMap((value) => {
        return this.verificationService.convertValueByType( value, Type.SEGMENT, repository);
      }),
    );

    this.conformanceProfileVerificationResults$ = this.store.select(selectVerificationResult).pipe(
      concatMap((value) => {
        return this.verificationService.convertValueByType( value, Type.CONFORMANCEPROFILE, repository);
      }),
    );
    this.igVerificationResult$ = this.store.select(selectVerificationResult).pipe(
      concatMap((value) => {
        return this.verificationService.convertValueByType( value, Type.IGDOCUMENT, repository);
      }),
    );

    this.store.select(selectVerificationStatus).subscribe((x) =>{
      this.loading = x.loading;

    })
   // verificationService.getVerificationEntryTable()
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


  selectType(type: Type){
    this.type = type;
  }


  onDeactivate(): void {
  }

  ngOnInit() {
  }

}
export  interface IVerificationReport{
  igVerificationResult?: any;
  segmentVerificationResults?: any;
  conformanceProfileVerificationResults?: any;
  datatypeVerificationResults?: any;
  valuesetVerificationResults?: any;
}
export  interface IVerificationReport{
  ig?: any;
  segment?: any;
  message?: any;
  datatype?: any;
  valueset?: any;
}
