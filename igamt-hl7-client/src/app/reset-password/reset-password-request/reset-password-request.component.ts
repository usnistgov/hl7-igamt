import { Component, OnInit } from '@angular/core';
import {ResetPasswordService} from "../reset-password.service";
import {MessageService} from "primeng/components/common/messageservice";

@Component({
  selector: 'app-reset-password-request',
  templateUrl: './reset-password-request.component.html',
  styleUrls: ['./reset-password-request.component.css']
})
export class ResetPasswordRequestComponent implements OnInit {

  sent:boolean=false;
  alertId="ResetPasswordRequestERROR";

  constructor(private resetPasswordService: ResetPasswordService,private messageService:MessageService) { }

  ngOnInit() {
  }


  sendPasswordResetLink(email){
    this.resetPasswordService.sendPasswordResetLink(email).then(x=>{

        this.sent=true;

      },

    error=>{

      this.showError(error);
    }

    );
  }



  showError(error:any) {
    console.log(error);
    error =JSON.parse(error.error.message);
    console.log(error);
    this.messageService.add({severity:'error', summary:"Authentication Error", detail:error.message, id:this.alertId});
  }





}
