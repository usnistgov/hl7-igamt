/**
 * Created by ena3 on 10/5/18.
 */
import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {ProgressHandlerService} from "../service/progress-handler.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {ConfirmationService} from "primeng/components/common/confirmationservice";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor( private injector: Injector
  ) {

  }
  handleError(error: Error) {
    //  const router = this.injector.get(Router);
    // //
    // const progressHandler=this.injector.get(ProgressHandlerService);
    // const confirmationService= this.injector.get(ConfirmationService);

    // if(!(error instanceof HttpErrorResponse)){
    //   console.log(error);
    //    progressHandler.setReportableError(error);
    // }
  }


}
