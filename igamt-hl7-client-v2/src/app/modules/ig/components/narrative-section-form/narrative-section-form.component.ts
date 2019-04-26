import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-narrative-section-form',
  templateUrl: './narrative-section-form.component.html',
  styleUrls: ['./narrative-section-form.component.scss']
})
export class NarrativeSectionFormComponent implements OnInit {

  sectionForm: FormGroup;
  @Output()
  form: EventEmitter<FormGroup>;

  constructor() {
    this.form = new EventEmitter<FormGroup>();
    this.sectionForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(3)]),
      content: new FormControl(''),
    });
  }

  ngOnInit() {
    this.sectionForm.valueChanges.subscribe(
      (change) => {
        this.form.emit(this.sectionForm);
      },
    );
  }

}
