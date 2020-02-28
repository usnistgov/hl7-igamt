import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {FroalaService} from '../../../shared/services/froala.service';
import {DocumentationScope, DocumentationType, IDocumentation} from '../../models/documentation.interface';

@Component({
  selector: 'app-documentation-editor',
  templateUrl: './documentation-editor.component.html',
  styleUrls: ['./documentation-editor.component.css'],
})
export class DocumentationEditorComponent implements OnInit {
  sectionForm: FormGroup;
  froalaConfig$: Observable<any>;
  @Output()
  form: EventEmitter<FormGroup>;
  @Input()
  viewOnly: boolean;
  @Input()
  set data(data: IDocumentation) {
    console.log(data);
    this.sectionForm.patchValue(data, { emitEvent: false });
    console.log(this.sectionForm);

  }

  constructor(private froalaService: FroalaService) {
    this.form = new EventEmitter<FormGroup>();
    this.froalaConfig$ = this.froalaService.getDocumentationConfig();

    this.sectionForm = new FormGroup({
      id: new FormControl(''),
      label: new FormControl('', [Validators.required]),
      description: new FormControl(),
      scope: new FormControl(''),
      type: new FormControl(''),
      authors: new FormControl(''),
      dateUpdated: new FormControl(''),
      position: new FormControl(''),
    });
  }

  ngOnInit() {
    this.sectionForm.valueChanges
      .pipe(debounceTime(200))
      .subscribe(
        (change) => {
          console.log('HAS CHANGED');
          this.form.emit(this.sectionForm);
        },
      );
  }

  getDescription() {
    return this.sectionForm.getRawValue()['description'];
  }
}
