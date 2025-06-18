import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable, of, throwError } from 'rxjs';
import { catchError, filter, flatMap, map, pluck, take, tap, withLatestFrom } from 'rxjs/operators';
import * as fromDam from 'src/app/modules/dam-framework/store/index';
import { MetadataAttributeConfigComponent } from 'src/app/modules/shared/components/metadata-attribute-config/metadata-attribute-config.component';
import { Type } from 'src/app/modules/shared/constants/type.enum';
import { EditorID } from 'src/app/modules/shared/models/editor.enum';
import { IgEditResolverLoad } from '../../../../root-store/ig/ig-edit/ig-edit.actions';
import { selectIgVersions } from '../../../../root-store/ig/ig-edit/ig-edit.selectors';
import { AbstractEditorComponent } from '../../../core/components/abstract-editor-component/abstract-editor-component.component';
import { MessageService } from '../../../dam-framework/services/message.service';
import { FieldType, IMetadataField, IMetadataFormInput } from '../../../shared/components/metadata-form/metadata-form.component';
import { Status } from '../../../shared/models/abstract-domain.interface';
import { IDisplayElement } from '../../../shared/models/display-element.interface';
import { FroalaService } from '../../../shared/services/froala.service';
import { IgDocument } from '../../models/ig/ig-document.class';
import { IgService } from '../../services/ig.service';

export interface IIgEditMetadata {
  coverPicture: string;
  title: string;
  subTitle: string;
  version: string;
  organization: string;
  authors: string[];
  status: Status;
  implementationNotes?: any;
  authorNotes: any;
  customAttributes?: ICoustomAttribute[];
}

@Component({
  selector: 'app-ig-metadata-editor',
  templateUrl: './ig-metadata-editor.component.html',
  styleUrls: ['./ig-metadata-editor.component.scss'],
})
export class IgMetadataEditorComponent extends AbstractEditorComponent implements OnInit {

  coverPictureFile$: BehaviorSubject<File>;
  metadataFormInput: IMetadataFormInput<IIgEditMetadata>;
  froalaConfig$: Observable<any>;
  metadataForm: FormGroup;
  customAttributes$: BehaviorSubject<ICoustomAttribute[]>;

  cols = [
    { field: 'Cutom Attrinutes', header: 'Value' },
    { field: 'action', header: '' },
  ];

  formGroup: FormGroup;

  constructor(
    store: Store<any>,
    actions$: Actions,
    private igService: IgService,
    protected formBuilder: FormBuilder,

    private messageService: MessageService, private froalaService: FroalaService, private dialog: MatDialog) {
    super(
      {
        id: EditorID.IG_METADATA,
        resourceType: Type.IGDOCUMENT,
        title: 'Metadata',
      },
      actions$,
      store,
    );

    this.coverPictureFile$ = new BehaviorSubject<File>(null);
    this.customAttributes$ = new BehaviorSubject<ICoustomAttribute[]>(null);
    this.currentSynchronized$.pipe(
      flatMap((metadata) => {
        this.customAttributes$.next(metadata.customAttributes);

        return this.store.select(selectIgVersions).pipe(
          take(1),
          tap((versions) => {

            const ret = {
              ...metadata,
              pictureFile: {
                url: metadata.coverPicture,
              },
              hl7Versions: versions,
            };
            this.initFormGroup(ret);
            this.formGroup.valueChanges.subscribe((changed) => {

              this.dataChange();
            });

          }),
        );
      }),
    ).subscribe();
  }

  initFormGroup(metadata) {
    this.formGroup = this.formBuilder.group({
      title: [''],
      pictureFile: [''],
      subTitle: [''],
      version: [''],
      organization: [''],
      authors: [''],
      authorNotes: [''],
    });
    this.formGroup.patchValue(metadata);
  }

  initCustomAttributes(attributes: ICoustomAttribute[]): FormArray {
    const formArray = this.formBuilder.array([]);

    attributes.forEach((attribute) => {
      const attributeGroup = this.formBuilder.group({
        name: [attribute.name || ''],
        value: [attribute.value || ''],
      });

      formArray.push(attributeGroup);
    });

    return formArray;
  }

  getNameControlName(index: number) {
    const item = this.getCustoms().at(index).value;
    return Object.keys(item)[0];
  }

  getCustoms(): FormArray {
    return this.formGroup.get('customAttributes') as FormArray;
  }

  addAttr(custom: FormArray, title: string) {
    custom.push(this.formBuilder.group({
      [title]: [''],
    }));
  }

  removeItem(index: number) {
    this.customAttributes$.pipe(map((x: ICoustomAttribute[]) => x.splice(index, 1))).subscribe();
    this.dataChange();
  }

  openCustomAttributeDialog() {

    const dialogRef = this.dialog.open(MetadataAttributeConfigComponent, {
      data: { form: this.metadataFormInput },
    });
    dialogRef.afterClosed().pipe(
      filter((res) => res !== undefined),
      take(1),
      map((result: string) => {
        this.customAttributes$.pipe(map((x) => x.push({ name: result, value: '' }))).subscribe();
        this.dataChange();
      }),
    ).subscribe();

  }

  dataChange() {
    this.current$.pipe(
      take(1),
      withLatestFrom(this.customAttributes$),
      tap(([current, custom]) => {
        this.coverPictureFile$.next(this.formGroup.getRawValue().pictureFile);
        this.editorChange(Object.assign(current.data, { ...this.formGroup.getRawValue(), customAttributes: custom }), this.formGroup.valid);
      }),
    ).subscribe();
  }

  convert() {

    const ret = this.formGroup.getRawValue();
    ret.customAttributes = ret.customAttributes.map((item) => {
      const key = Object.keys(item)[0];
      const value = item[key];
      return { name: key, value };
    });
    return ret;
  }

  modelChange() {
    this.dataChange();
  }

  onEditorSave(action: fromDam.EditorSave): Observable<Action> {
    return combineLatest(this.elementId$, this.current$, this.coverPictureFile$.pipe(
      map((elm) => elm instanceof File ? elm : null),
    )).pipe(
      take(1),
      flatMap(([id, current, coverPicture]) => {
        const coverPictureName$: Observable<string> = !coverPicture ? of(null) :
          this.igService.uploadCoverImage(coverPicture).pipe(
            pluck('link'),
          );

        return coverPictureName$.pipe(
          flatMap((pictureName) => {
            return this.igService.saveMetadata(id, {
              ...current.data,
              coverPicture: pictureName ? pictureName : current.data.coverPicture,
            }).pipe(
              flatMap((response) => {
                return [
                  new IgEditResolverLoad(id),
                  new fromDam.EditorUpdate({
                    value: {
                      ...current.data,
                      coverPicture: pictureName ? pictureName : current.data.coverPicture,
                    },
                    updateDate: false,
                  }),
                  this.messageService.messageToAction(response),
                ];
              }),
              catchError((error) => {
                return throwError(this.messageService.actionFromError(error));
              }),
            );
          }),
        );
      }),
    );
  }

  editorDisplayNode(): Observable<IDisplayElement> {
    return this.document$.pipe(
      map((document) => {
        return this.igService.igToIDisplayElement(document as IgDocument);
      }),
    );
  }

  ngOnInit() {
    this.froalaConfig$ = this.froalaService.getConfig();
  }

  onDeactivate() {

  }

  getModelFormMetadata() {
    return {
      pictureFile: {
        label: 'Cover Picture',
        placeholder: '',
        validators: [],
        type: FieldType.FILE,
        id: 'picture',
        name: 'picture',
      },
      title: {
        label: 'Title',
        placeholder: 'Title',
        validators: [],
        type: FieldType.TEXT,
        id: 'title',
        name: 'Title',
      },
      subTitle: {
        label: 'Subtitle',
        placeholder: 'Subtitle',
        validators: [],
        type: FieldType.TEXT,
        id: 'subtitle',
        name: 'Subtitle',
      },
      version: {
        label: 'Version',
        placeholder: 'Version',
        validators: [],
        type: FieldType.TEXT,
        id: 'version',
        name: 'Version',
      },
      organization: {
        label: 'Organization',
        placeholder: 'Organization',
        validators: [],
        enum: [],
        type: FieldType.TEXT,
        id: 'Organization',
        name: 'Organization',
      },
      authors: {
        label: 'Authors',
        placeholder: 'Type name and press Enter',
        validators: [],
        enum: [],
        type: FieldType.STRING_LIST,
        id: 'Authors',
        name: 'Authors',
      },
      hl7Versions: {
        label: 'HL7 Versions',
        placeholder: 'HL7 Versions',
        validators: [],
        disabled: true,
        enum: [],
        type: FieldType.STRING_LIST,
        id: 'HL7Versions',
        name: 'HL7Versions',
      },
      authorNotes: {
        label: 'Author Notes',
        addBefore: true,
        placeholder: 'Author Notes',
        validators: [],
        enum: [],
        type: FieldType.RICH,
        id: 'authorNotes',
        name: 'authorNotes',
      },
    };
  }

}
export interface ICoustomAttribute {
  name: string;
  value: string;
  position?: number;
  type?: FieldType;
}
