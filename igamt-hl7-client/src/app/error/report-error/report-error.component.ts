// import { Component, OnInit } from '@angular/core';
// import {PrimeDialogAdapter} from "../../common/prime-ng-adapters/prime-dialog-adapter";
// import {ClientErrorHandlerService} from "../../utils/client-error-handler.service";
//
// @Component({
//   selector: 'app-report-error',
//   templateUrl: './report-error.component.html',
//   styleUrls: ['./report-error.component.css']
// })
// export class ReportErrorComponent extends PrimeDialogAdapter{
//
//   error ={};
//   constructor(private clientErrorHandlerService :ClientErrorHandlerService) {
//     super();
//   }
//
//   ngOnInit() {
//     // Mandatory
//     super.hook(this);
//   }
//
//
//   onDialogOpen() {
//
//
//   }
//
//   close() {
//     this.dismissWithNoData();
//
//   }
//
//   closeWithData(data: any) {
//     this.dismissWithData(data.data);
//   }
//
//
// }
