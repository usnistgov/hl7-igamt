import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {getHl7Versions} from '../../../../root-store/config/config.reducer';
import {CreateLibrary} from '../../../../root-store/create-library/create-library.actions';
import {LoadResource} from '../../../../root-store/resource-loader/resource-loader.actions';
import {getData} from '../../../../root-store/resource-loader/resource-loader.reducer';
import {IDocumentCreationWrapper} from '../../../document/models/document/document-creation.interface';
import {Scope} from '../../../shared/constants/scope.enum';
import {Type} from '../../../shared/constants/type.enum';
import {IAddingInfo} from '../../../shared/models/adding-info';
import {IResource} from '../../../shared/models/resource.interface';
@Component({
  selector: 'app-create-library',
  templateUrl: './create-library.component.html',
  styleUrls: ['./create-library.component.scss'],
})
export class CreateLibraryComponent implements OnInit {

  resources$: Observable<IResource[]>;
  hl7Version$: Observable<string[]>;
  metaDataForm: FormGroup;
  selected: IAddingInfo[] = [];

  constructor(private store: Store<any>) {
    this.hl7Version$ = this.store.select(getHl7Versions);
    this.metaDataForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
    });
    this.resources$ = this.store.select(getData);
  }

  ngOnInit() {
  }

  selectVersion($event: string) {
    this.store.dispatch(new LoadResource({ type: Type.DATATYPE, scope: Scope.HL7STANDARD, version: $event }));
  }
  submit() {

    const model: IDocumentCreationWrapper = {
      metadata: this.metaDataForm.getRawValue(), scope: Scope.USER,
      selected: this.selected,
    };
    this.store.dispatch(new CreateLibrary(model));
  }

  updateAdded($event: IAddingInfo[]) {
    console.log($event);
    this.selected = $event;
  }
}
