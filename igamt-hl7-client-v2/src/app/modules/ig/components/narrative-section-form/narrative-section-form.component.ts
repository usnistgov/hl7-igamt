import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { INarrative } from '../ig-section-editor/ig-section-editor.component';

@Component({
  selector: 'app-narrative-section-form',
  templateUrl: './narrative-section-form.component.html',
  styleUrls: ['./narrative-section-form.component.scss'],
})
export class NarrativeSectionFormComponent implements OnInit {

  sectionForm: FormGroup;
  @Output()
  form: EventEmitter<FormGroup>;
  @Input()
  viewOnly: boolean;
  @Input()
  set data(data: INarrative) {
    this.sectionForm.patchValue(data, { emitEvent: false });
  }

  constructor() {
    this.form = new EventEmitter<FormGroup>();
    this.sectionForm = new FormGroup({
      id: new FormControl(''),
      label: new FormControl('', [Validators.required]),
      description: new FormControl(''),
    });
  }

  ngOnInit() {
    this.sectionForm.valueChanges
      .pipe(debounceTime(200))
      .subscribe(
        (change) => {
          console.log('X');
          this.form.emit(this.sectionForm);
        },
      );
  }

}
