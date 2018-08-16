import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ResetPasswordService} from "../reset-password.service";
import {FormGroup, Validators, FormControl, ValidatorFn, AbstractControl} from "@angular/forms";
import {MessageService} from "primeng/components/common/messageservice";

@Component({
  selector: 'app-reset-password-confirm',
  templateUrl: './reset-password-confirm.component.html',
  styleUrls: ['./reset-password-confirm.component.css']
})
export class ResetPasswordConfirmComponent implements OnInit {
  confirmPassword: any;
  resetPasswordFrom:FormGroup;
  model:any={};
  token : any;
  displayForm=true;
  alertId="ResetPasswordERROR";

  constructor(private route: ActivatedRoute, private resetPasswordService : ResetPasswordService, private router: Router,private messageService:MessageService) {
    this.resetPasswordFrom= new FormGroup({
      'password':new FormControl(this.model.password, [Validators.required,  Validators.minLength(8)]),
      'confirmPasswordForm':new FormControl(
        this.confirmPassword,
        [this.passwordValidator(this.model.password)] )
    });


  }

  ngOnInit() {
    // subscribe to router event
      this.model.token=this.route.snapshot.params["token"];
      console.log(this.token);

      this.resetPasswordService.validateToken( this.model.token).then( x =>{

        this.displayForm=true;

      }, error=>{
        this.router.navigate(['/404']);
      })


  }

  passwordValidator(obj: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      return this.confirmPassword !== this.model.password ? {'NotMAtch': {value: control.value}} : null;
    };

  }


  reset(){


    this.resetPasswordService.confirmPasswordReset(this.model).then(x=>{
      this.router.navigate(['/login']);


    },error=>{

      this.showError(error);
      }

    )


  }


  showError(error:any) {
    console.log(error);
    error =JSON.parse(error.error.message);
    console.log(error);
    this.messageService.add({severity:'error', summary:"Authentication Error", detail:error.message, id:this.alertId});
  }





}
