import { IDisplayElement } from './../../../shared/models/display-element.interface';
import { Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromDAM from 'src/app/modules/dam-framework/store/index';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { Type } from '../../../shared/constants/type.enum';
import { EditorID } from '../../../shared/models/editor.enum';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { IgDocument } from '../../models/ig/ig-document.class';
import { IgService } from '../../services/ig.service';
import { selectAllMessages, selectAllValueSets } from 'src/app/root-store/dam-igamt/igamt.resource-display.selectors';

@Component({
  selector: 'app-value-sets-summary-editor',
  templateUrl: './value-sets-summary-editor.component.html',
  styleUrls: ['./value-sets-summary-editor.component.scss'],
})
export class ValueSetsSummaryEditorComponent extends AbstractEditorComponent implements OnInit {

  vsbList$: Observable<any>;
  conformanceProfiles$: Observable<IDisplayElement[]>;
  allVs$: any;
  igId$: Observable<string>;


  constructor(
    store: Store<any>,
    actions$: Actions,
    private igService: IgService,
    public repository: StoreResourceRepositoryService) {
    super(
      {
        id: EditorID.VALUESETS_SUMMARY,
        title: 'Value Sets Summary',
        resourceType: Type.VALUESETREGISTRY,
      },
      actions$,
      store,
    );

    this.vsbList$ = this.currentSynchronized$.pipe(
      map((value) => {
        console.log("HERE")
        return value.summary;
      }),
    );
   this.igId$ = this.documentId$;
   this.conformanceProfiles$ = this.store.select(selectAllMessages);
   this.allVs$ = this.store
    .select(selectAllValueSets)
    .pipe(
      map((elements: IDisplayElement[]) => {
        const resultMap : any = {}
        elements.forEach(element => {
          resultMap[element.id] = element;
        });
        return resultMap;
      })
    );

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
