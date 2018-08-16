/**
 * Created by ena3 on 12/29/17.
 */
import {Component, ViewChild} from '@angular/core';
import {WorkspaceService} from "../../service/workspace/workspace.service";
import {Router, ActivatedRoute} from "@angular/router";
import {MenuItem} from 'primeng/api';
import {BreadcrumbService} from "../../breadcrumb.service";
import {DatatypeLibraryCreateService} from "./datatype-library.service";
import {DatatypeLibraryAddingService} from "../service/adding.service";
import {DatatypeListManagerComponent} from "../../common/datatype-list-manager/datatype-list-manager.component";
@Component({
  templateUrl: 'datatype-library-create.component.html'
})
export class DatatypeLibraryCreateComponent {
  loading=false;
  uploadedFiles: any[] = [];
  activeIndex: number = 0;
  blockUI=false;
  scope="MASTER";

  @ViewChild(DatatypeListManagerComponent) dtManager;

  list:any;
  metaData: any= {};
  items: MenuItem[];
  breadCurmp:MenuItem[];
  path: MenuItem[];

  hl7Versions: any[];
  selcetedVersion: any =null;

  constructor(private createService :DatatypeLibraryCreateService,private  datatypeLibraryAddingService :DatatypeLibraryAddingService,
              private router: Router,    private route: ActivatedRoute, private ws :  WorkspaceService, private  breadCrump:BreadcrumbService
  ) {
    this.path=[{label:"data type library"},{label:"create new Library"}];
    this.breadCrump.setItems(this.path);
    this.hl7Versions=ws.getAppConstant().hl7Versions;
  }

  ngOnInit() {

    this.items = [
      {
      label: 'Meta Data ',

      },
      {
        label: 'Data Types'
      }

      ];




    this.breadCurmp = [
      {
        label: 'Data Type Library',

      },
      {
        label: 'Create Data Type Library'
      }

    ];



  }




  goTo(res:any) {
    this.route.queryParams
      .subscribe(params => {
        var link="/datatype-library/"+res.id.id;
        this.loading=false;
        this.router.navigate([link], params); // add the parameters to the end
      });
  }

  print(obj){
    console.log(obj);
  }
  getDatatypes(version){
    this.list=[];
    this.datatypeLibraryAddingService.getHl7DatatypesByVersion(version).
    subscribe(list =>{

      this.list=list;
    },error=>{
    }
    )
  }




  next(ev){
    console.log("call next")
    this.activeIndex=1;

  }
  previous(ev){

    console.log("call previous")
    this.activeIndex=0;

  }
  upload(event) {
    this.metaData.coverPicture =JSON.parse(event.xhr.response).link;

    for(let file of event.files) {
      this.uploadedFiles.push(file);

    }


  }



  submit(){

  let wrapper={
    metadata: this.metaData,
    toAdd:this.dtManager.dest,
    scope:this.scope
  }
  console.log(wrapper);
    this.createService.create(wrapper).subscribe(x=>{
      console.log(x);
      this.goTo(x);

    } , error=>{


    });

  }

  isValid(){


  if(  this.dtManager && this.dtManager.addingForm){

    return this.dtManager.addingForm.valid;
  }
  else{
    return true;
  }
  }




}
