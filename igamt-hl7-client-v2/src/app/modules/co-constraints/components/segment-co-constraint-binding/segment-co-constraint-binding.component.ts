import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map, take, tap, mergeMap } from 'rxjs/operators';
import { CsDialogComponent } from '../../../shared/components/cs-dialog/cs-dialog.component';
import { Type } from '../../../shared/constants/type.enum';
import { IDocumentRef } from '../../../shared/models/abstract-domain.interface';
import {
  CoConstraintGroupBindingType,
  ICoConstraintBindingSegment,
  ICoConstraintGroupBindingRef,
  ICoConstraintTable,
  ICoConstraintTableConditionalBinding,
  IStructureElementRef,
} from '../../../shared/models/co-constraint.interface';
import { IConformanceProfile } from '../../../shared/models/conformance-profile.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { ISegment } from '../../../shared/models/segment.interface';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { CoConstraintEntityService } from '../../services/co-constraint-entity.service';
import { CoConstraintGroupSelectorComponent } from '../co-constraint-group-selector/co-constraint-group-selector.component';
import { CoConstraintAction, CoConstraintTableComponent } from '../co-constraint-table/co-constraint-table.component';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FileUploadService } from '../../services/file-upload.service';
import { flatMap } from 'lodash';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component';
import { MessageService } from 'src/app/modules/dam-framework/services/message.service';
import { UserMessage, MessageType } from '../../../dam-framework/models/messages/message.class';

@Component({
  selector: 'app-segment-co-constraint-binding',
  templateUrl: './segment-co-constraint-binding.component.html',
  styleUrls: ['./segment-co-constraint-binding.component.scss'],
})
export class SegmentCoConstraintBindingComponent implements OnInit {

  segment$: Observable<ISegment>;
  binding: ICoConstraintBindingSegment;
  userMessage: UserMessage;

  formMap: {
    [id: number]: NgForm;
  } = {};

  @Input()
  delta: boolean;
  @Input()
  derived: boolean;
  @Input()
  viewOnly: boolean;
  @Input()
  datatypes: IDisplayElement[];
  @Input()
  valueSets: IDisplayElement[];
  @Input()
  segments: IDisplayElement[];
  @Input()
  conformanceProfile: Observable<IConformanceProfile>;
  @Input()
  context: IStructureElementRef;
  @Input()
  documentRef: IDocumentRef;
  @Output()
  valueChange: EventEmitter<ICoConstraintBindingSegment>;
  @Output()
  formValid: EventEmitter<boolean>;
  @ViewChildren(CoConstraintTableComponent)
  tableComponents: QueryList<CoConstraintTableComponent>;
  @Output()
  delete: EventEmitter<boolean>;
  display$: Observable<IDisplayElement>;

  excelImport : boolean=false;

  // Variable to store shortLink from api response 
  shortLink: string = ""; 
  loading: boolean = false; // Flag variable 
  file: File = null; // Variable to store file 



  // On file Select 
  onChange(event) { 
      this.file = event.target.files[0]; 
  } 

  // OnClick of button Upload 
  onUpload() { 
          console.log(this.file); 
      this.conformanceProfile.pipe(
        take(1),
        mergeMap((cp) => {
          return this.fileUploadService.upload(this.file, this.binding.flavorId, cp.id,this.documentRef.documentId, this.context.pathId).pipe(
            map((v) => {
              console.log(v.data );
              this.store.dispatch(this.messageService.messageToAction(v));
              this.binding.tables.push({ delta: undefined, value: v.data, condition: undefined });  
              console.log(this.binding.tables);          
            })
          );
        })
    ).subscribe();

  }

  openImportDialog(){
    const dialogRef = this.dialog.open(ImportDialogComponent, {
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        fileUploadService: this.fileUploadService,
        flavorId: this.binding.flavorId,
        conformanceProfile: this.conformanceProfile,
        documentId : this.documentRef.documentId,
        pathId: this.context.pathId,

      },
    });
    dialogRef.afterClosed().subscribe(
      (coConstraintTable) => {
        if(coConstraintTable) {
          console.log("in segment class : ", coConstraintTable);

          this.store.dispatch(this.messageService.userMessageToAction(new UserMessage<never>(MessageType.SUCCESS, "TABLE SAVED SUCCESSFULLY"))

        );
          this.binding.tables.push({ delta: undefined, value: coConstraintTable, condition: undefined });  
          console.log(this.binding.tables);          }
      },
    ); 
  }

  @Input()
  set value(binding: ICoConstraintBindingSegment) {
    this.binding = {
      ...binding,
    };
    this.display$ = this.repository.getResourceDisplay(Type.SEGMENT, binding.flavorId);
    this.segment$ = this.getSegment(binding.flavorId);
  }

  constructor(
    protected actions$: Actions,
    private dialog: MatDialog,
    protected store: Store<any>,
    public repository: StoreResourceRepositoryService,
    private fileUploadService: FileUploadService,
    private messageService: MessageService,
    protected ccService: CoConstraintEntityService) {
    this.valueChange = new EventEmitter<ICoConstraintBindingSegment>();
    this.delete = new EventEmitter<boolean>();
    this.formValid = new EventEmitter<boolean>();
  }

  exportAsExcel(table: ICoConstraintTable) {
    this.ccService.exportAsExcel(table);
  }
  importAsExcel(){
    console.log("Button import excel working");
    this.excelImport = true;
  }
  triggerRemove() {
    this.delete.emit(true);
  }

  getSegment(id: string): Observable<ISegment> {
    return this.repository.fetchResource(Type.SEGMENT, id).pipe(take(1), map((seg) => seg as ISegment));
  }

  createTable(binding: ICoConstraintBindingSegment, segment: ISegment) {
    this.ccService.createCoConstraintTableForSegment(segment, this.repository).pipe(
      take(1),
      tap((table) => {
        binding.tables.push({
          condition: undefined,
          value: table,
        });
        this.triggerChange();
      }),
    ).subscribe();
  }

  importCoConstraintGroup(binding: ICoConstraintBindingSegment, id: number) {
    const component = this.tableComponents.find((table) => table.id === id);
    const display = this.segments.find((elm) => elm.id === binding.flavorId);
    if (display && component) {
      const dialogRef = this.dialog.open(CoConstraintGroupSelectorComponent, {
        data: {
          segment: display,
          documentRef: this.documentRef,
        },
      });

      dialogRef.afterClosed().subscribe(
        (result: IDisplayElement[]) => {
          if (result) {
            result.forEach((groupDisplay) => {
              const exist = component.value.groups.find((elm) => {
                return elm.type === CoConstraintGroupBindingType.REF && (elm as ICoConstraintGroupBindingRef).refId === groupDisplay.id;
              });

              if (!exist) {
                component.dispatch({
                  type: CoConstraintAction.IMPORT_GROUP,
                  payload: this.ccService.createCoConstraintGroupBinding(groupDisplay.id),
                });
              }
            });
          }
        },
      );
    }
  }

  openConditionDialog(context: any, conditional: ICoConstraintTableConditionalBinding) {
    const dialogRef = this.dialog.open(CsDialogComponent, {
      maxWidth: '150vw',
      maxHeight: '130vh',
      data: {
        title: 'Co-Constraint Table Conditional',
        assertionMode: true,
        context: context.path,
        assertion: conditional.condition,
        resource: this.conformanceProfile,

        
        excludePaths: [this.binding.segment.pathId],
      },
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          conditional.condition = result.assertion;
          this.triggerChange();
        }
      },
    );
  }

  addCoConstraintGroup(id: number) {
    const group = this.ccService.createEmptyContainedGroupBinding();
    const component = this.tableComponents.find((table) => table.id === id);
    if (component) {
      component.dispatch({
        type: CoConstraintAction.ADD_GROUP,
        payload: group,
      });
    }
  }

  deleteTable(segment: ICoConstraintBindingSegment, i: number) {
    segment.tables.splice(i, 1);
    this.triggerChange();
  }

  clearCondition(conditional: ICoConstraintTableConditionalBinding) {
    conditional.condition = undefined;
    this.triggerChange();
  }

  tableChange(table: ICoConstraintTable, id: number) {
    if (id >= 0 && this.binding.tables.length > id) {
      this.formValid.emit(this.isFormValid());
      this.valueChange.emit({
        ...this.binding,
        tables: [
          ...this.binding.tables.map((elm, i) => {
            if (i !== id) {
              return elm;
            } else {
              return {
                ...elm,
                value: table,
              };
            }
          }),
        ],
      });
    }
  }

  formChange(form: NgForm, id: number) {
    this.formMap[id] = form;
  }

  triggerChange() {
    this.valueChange.emit(this.binding);
  }

  isFormValid(): boolean {
    for (const key of Object.keys(this.formMap)) {
      if (!this.formMap[key].valid) {
        return false;
      }
    }
    return true;
  }

  ngOnInit() {
    console.log(this.binding);
  }

}
