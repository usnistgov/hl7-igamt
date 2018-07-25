import { Component, OnInit } from '@angular/core';
import {PrimeDialogAdapter} from "../../../common/prime-ng-adapters/prime-dialog-adapter";
import {DeleteElementService} from "./delete-element.service";
import {IgErrorService} from "../ig-error/ig-error.service";

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

  constructor(private deleteService:DeleteElementService, private igErrorService: IgErrorService ) {
    super();


  }

  ngOnInit() {
    // Mandatory
    super.hook(this);
  }


  onDialogOpen() {
    // Init code
  }

  close() {

    this.dismissWithNoData();
  }

  closeWithData(data: any) {
    this.dismissWithData(data);
  }


  submit(){

    this.deleteService.deleteElement(this.igId, this.id,this.type).subscribe(
      res => {
        console.log(res);
        this.closeWithData(res);
      } ,error =>{
        this.igErrorService.showError(error);


      }
    )

  }


  print(obj){
    console.log(obj);
  }
}
