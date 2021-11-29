/**
 * Created by hnt5 on 1/18/18.
 */
import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import {NgModel, NgForm, ValidatorFn} from '@angular/forms';

@Directive({
    selector: '[registerForm]'
})
export class RegisterFormModelDirective implements OnInit {
    private el: HTMLInputElement;

    @Input('registerForm') public form: NgForm;
    @Input('registerModel') public model: NgModel;
    @Input('registerValidators') public validators: ValidatorFn;

    constructor(el: ElementRef) {
        this.el = el.nativeElement;
    }

    ngOnInit() {
        if (this.form && this.model) {
            if(this.validators){
                this.model.control.setValidators(this.validators);
            }

            if(!this.form.form.controls[this.model.name]){
                this.form.form.addControl(this.model.name, this.model.control);
            }
        }
    }
}
