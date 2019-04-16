import {Component, OnInit, ViewChild} from '@angular/core';
import {LibErrorService} from "../lib-error/lib-error.service";
import {WorkspaceService} from "../../../service/workspace/workspace.service";
import {PrimeDialogAdapter} from "../../../common/prime-ng-adapters/prime-dialog-adapter";
import {DatatypeListManagerComponent} from "../../../common/datatype-list-manager/datatype-list-manager.component";
import {DatatypeLibraryAddingService} from "../../service/adding.service";

@Component({
  selector: 'lib-datatype-add',
  templateUrl: './lib-datatype-add.component.html',
  styleUrls: ['./lib-datatype-add.component.css']
})
export class LibDatatypeAddComponent extends  PrimeDialogAdapter {

  hl7Versions: any[];
  id="";
  sources:any[]=[];
  dest: any[] = [];
  scope="";
  namingIndicators = [];
  @ViewChild(DatatypeListManagerComponent) dtManager;



  constructor(private ws: WorkspaceService, private errorService:LibErrorService,  private addingService : DatatypeLibraryAddingService) {
    super();
  }
  ngOnInit() {
    // Mandatory
    super.hook(this);
  }
  onDialogOpen(){
    // Init code
    this.dest = [];
  }
  close(){
    this.dismissWithNoData();
  }
  closeWithData(res: any) {
    this.dismissWithData(res.data);
  }
  submit(){
    let wrapper:any ={};
    wrapper.toAdd=this.dtManager.getAdded();
    wrapper.id=this.id;
    wrapper.scope=this.scope;
    this.addingService.addDatatypes(wrapper).subscribe(
      res => {
        console.log(res);
        this.closeWithData(res);
      },error=>{
      }
    )
  }
  print(obj){
    console.log(obj);
  }
  isValid(){
    if(this.dtManager && this.dtManager.addingForm){
      return this.dtManager.addingForm.valid;
    } else{
      return true;
    }
  }
}
