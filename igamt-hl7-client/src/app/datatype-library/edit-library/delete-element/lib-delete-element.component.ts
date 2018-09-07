import { Component, OnInit } from '@angular/core';
import {PrimeDialogAdapter} from "../../../common/prime-ng-adapters/prime-dialog-adapter";
import {LibDeleteElementService} from "./lib-delete-element.service";
import {ExceptionType} from "../../../common/constants/ExceptionType";
import {LibErrorService} from "../lib-error/lib-error.service";

@Component({
  selector: 'lib-delete-element',
  templateUrl: 'lib-delete-element.component.html',
  styleUrls: ['lib-delete-element.component.css']
})
export class LibDeleteElementComponent extends PrimeDialogAdapter{
  libId="";
  name="";
  ext="";
  type="";
  id="";
  node="";
  xreferences:null;


  constructor(private deleteService:LibDeleteElementService, private errorService: LibErrorService) {
    super();


  }

  ngOnInit() {
    // Mandatory
    this.xreferences=null;

    super.hook(this);
  }


  onDialogOpen() {
    // Init code
  }

  close() {
    this.xreferences=null;
    this.dismissWithNoData();
  }

  closeWithData(data: any) {
    this.dismissWithData(data);
  }


  submit(){

    this.deleteService.deleteElement(this.libId, this.id,this.type).subscribe(
      res => {
        this.dismissWithData(this.id);

      } ,error =>{
        if(error.error.type ==ExceptionType.XREFERENCEFOUND){
          this.xreferences=error.error.xreferences;

        }else{
           this.errorService.showError(error);
        }

      }
    )

  }


  print(obj){
    console.log(obj);
  }




}
