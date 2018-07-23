import {Directive, Input} from '@angular/core';
import {NgForm, NgModel, NG_VALIDATORS} from "@angular/forms";

@Directive({
  selector: '[AttachToForm]'

})
export class AttachToFormDirective {
  @Input() public parentForm: NgForm;
  @Input() public input: NgModel;
  constructor() { }

  ngOnInit() {
    if (this.parentForm && this.input) {


      if(!this.parentForm.form.controls[this.input.name]){
        this.parentForm.form.addControl(this.input.name, this.input.control);
      }
    }
  }

}
