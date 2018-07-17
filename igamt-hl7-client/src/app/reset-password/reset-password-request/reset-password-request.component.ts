import { Component, OnInit } from '@angular/core';
import {ResetPasswordService} from "../reset-password.service";

@Component({
  selector: 'app-reset-password-request',
  templateUrl: './reset-password-request.component.html',
  styleUrls: ['./reset-password-request.component.css']
})
export class ResetPasswordRequestComponent implements OnInit {

  sent:boolean=false;

  constructor(private resetPasswordService: ResetPasswordService) { }

  ngOnInit() {
  }


  sendPasswordResetLink(email){
    this.resetPasswordService.sendPasswordResetLink(email).then(x=>{

        this.sent=true;

      },

    error=>{



    }

    );
  }

}
