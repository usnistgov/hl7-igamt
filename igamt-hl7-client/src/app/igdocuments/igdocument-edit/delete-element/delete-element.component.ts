import { Component, OnInit } from '@angular/core';
import {PrimeDialogAdapter} from "../../../common/prime-ng-adapters/prime-dialog-adapter";
import {DeleteElementService} from "./delete-element.service";
import {IgErrorService} from "../ig-error/ig-error.service";
import {ExceptionType} from "../../../common/constants/ExceptionType";
import {TocService} from "../service/toc.service";

@Component({
  selector: 'app-delete-element',
  templateUrl: './delete-element.component.html',
  styleUrls: ['./delete-element.component.css']
})
export class DeleteElementComponent  extends PrimeDialogAdapter{
  igId="";
  name="";
  ext="";
  type="";
  id="";
  node="";

  xreferences:null;


  constructor(private deleteService:DeleteElementService, private igErrorService: IgErrorService) {
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

    this.deleteService.deleteElement(this.igId, this.id,this.type).subscribe(
      res => {
        this.dismissWithData(this.id);

      } ,error =>{

        if(error.error.type ==ExceptionType.XREFERENCEFOUND){



            this.xreferences=error.error.xreferences;

        }else{

           this.igErrorService.showError(error);


        }

      }
    )

  }


  print(obj){
    console.log(obj);
  }




}
