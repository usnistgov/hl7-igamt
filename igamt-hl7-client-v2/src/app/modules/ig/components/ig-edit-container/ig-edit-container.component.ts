import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromIgEdit from 'src/app/root-store/ig/ig-edit/ig-edit.index';
import { MetadataModel } from '../../../shared/components/metadata-form/metadata-form.component';
import { IIGMetadataForm } from '../../models/ig/metadata-form.interface';
import { ITitleBarMetadata } from '../ig-edit-titlebar/ig-edit-titlebar.component';

@Component({
  selector: 'app-ig-edit-container',
  templateUrl: './ig-edit-container.component.html',
  styleUrls: ['./ig-edit-container.component.scss'],
})
export class IgEditContainerComponent implements OnInit {

  titleBar: Observable<ITitleBarMetadata>;
  text: string;
  metamodel: MetadataModel<IIGMetadataForm>;
  constructor(private store: Store<fromIgEdit.IState>) {
    this.titleBar = this.store.select(fromIgEdit.selectTitleBar);
    this.metamodel = {
      name: {
        label: 'Title',
        placeholder: 'Title',
        validators: [],
        value: '',
        enum: [],
        type: 'TEXT',
        id: 'title',
        name: 'Title',
        viewOnly: false,
      },
      version: {
        label: 'Version',
        placeholder: 'version',
        validators: [],
        value: '',
        enum: [],
        type: 'TEXT',
        id: 'version',
        name: 'Version',
        viewOnly: false,
      },
      organization: {
        label: 'Organization',
        placeholder: 'Organization',
        validators: [],
        value: '',
        enum: [],
        type: 'TEXT',
        id: 'Organization',
        name: 'Organization',
        viewOnly: false,
      },
      status: {
        label: 'Status',
        placeholder: 'Status',
        validators: [],
        value: '',
        enum: [
          {
            value: 'DRAFT',
            label: 'Draft',
          },
          {
            value: 'PUBLISHED',
            label: 'Published',
          },
          {
            value: 'SUPERSEDED',
            label: 'Superseded',
          },
        ],
        type: 'SELECT',
        id: 'status',
        name: 'Status',
        viewOnly: false,
      },
      authors: {
        label: 'Authors',
        placeholder: 'Authors',
        validators: [],
        value: [],
        enum: [],
        type: 'STRING_LIST',
        id: 'authors',
        name: 'authors',
        viewOnly: false,
      },
      description: {
        label: 'Description',
        placeholder: 'Description',
        validators: [],
        value: '',
        enum: [],
        type: 'RICH',
        id: 'description',
        name: 'description',
        viewOnly: false,
      },
    };
  }

  ngOnInit() {
  }

}
