/**
 * Created by ena3 on 12/29/17.
 */
import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatStepper} from "@angular/material";
import {IgDocumentCreateService} from "./igdocument-create.service";
import {TreeNode} from "primeng/components/common/treenode";
import {WorkspaceService} from "../../service/workspace/workspace.service";
import {Router, ActivatedRoute} from "@angular/router";


@Component({
  templateUrl: './igdocument-create.component.html'
})
export class IgDocumentCreateComponent {
  isLinear = true;
  tableValue :TreeNode[];
  loading=false;

  metaData= {
    title:"",
    subTitle:"",
    organization:""
  };

  selectedNodes: TreeNode[];
  firstFormGroup: FormGroup;
  msgEvts: any[];
  messageEventMap={};
  secondFormGroup: FormGroup;
  @ViewChild('stepper') private myStepper: MatStepper;
  hl7Versions: any[];
  selcetedVersion: any;

  constructor(private _formBuilder: FormBuilder,private createService :IgDocumentCreateService, private workSpace : WorkspaceService,
              private router: Router,    private route: ActivatedRoute,
  ) {

    this.hl7Versions=this.workSpace.getAppInfo()["hl7Versions"];

    console.log(this.workSpace.getAppInfo());
  }

  ngOnInit() {

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }


  totalStepsCount: number;




  ngAfterViewInit() {
    this.totalStepsCount = this.myStepper._steps.length;
  }

  goBack(stepper: MatStepper) {
    stepper.previous();
  }
  goForward(stepper: MatStepper) {
    stepper.next();
  }


  getMessages(hl7Version){
    this.tableValue=[];
    this.createService.getMessagesByVersion(hl7Version).then(

      res => this.tableValue= res
    )
  }

  load(){
    console.log(this.selectedNodes);
    this.selectedNodes=[];
    this.getMessages(this.selcetedVersion);
  }

  nodeSelect(event){
    console.log(event);
  };

  toggle(node){
    if(node.data.checked){
      this.addNode(node);
    }else{
      this.removeNode(node);
    }
  };

  addNode(node){
    console.log("Add Node");
    console.log(node);

  };

  removeNode(node){
    console.log("Remove");
    console.log(node);

  };

  submitEvent(){
    for(let i=0 ;i<this.selectedNodes.length; i++){
      if(this.selectedNodes[i].data.parentStructId){
        if(this.selectedNodes[i].parent.data.id){
          if(this.messageEventMap[this.selectedNodes[i].parent.data.id]){
            if(this.messageEventMap[this.selectedNodes[i].parent.data.id].children) {
              this.messageEventMap[this.selectedNodes[i].parent.data.id].children.push({
                name:this.selectedNodes[i].data.name,
                parentStructId:this.selectedNodes[i].parent.data.structId


              });
            }else{
              this.messageEventMap[this.selectedNodes[i].parent.data.id].children=[];
              this.messageEventMap[this.selectedNodes[i].parent.data.id].children.push({
                name:this.selectedNodes[i].data.name,
                parentStructId:this.selectedNodes[i].parent.data.structId


              })
            }
          }else{
            this.messageEventMap[this.selectedNodes[i].parent.data.id]={};
            this.messageEventMap[this.selectedNodes[i].parent.data.id].children=[];
            this.messageEventMap[this.selectedNodes[i].parent.data.id].children.push({
              name:this.selectedNodes[i].data.name,
              parentStructId:this.selectedNodes[i].parent.data.structId

            })


          }
        }

      }
    }
   this.msgEvts=Object.keys(this.messageEventMap).map((key)=>{ return {id:key, children:this.messageEventMap[key].children}});


  }


  create(){
    this.loading=true;
    this.submitEvent();
  let wrapper:any ={};


  wrapper.msgEvts=this.msgEvts;
  wrapper.metaData=this.metaData;
  wrapper.hl7Version=this.selcetedVersion;

    this.createService.createIntegrationProfile(wrapper).then(
      res => {

        this.goTo(res.id);
      }
    )


  };

  goTo(id) {


    this.route.queryParams
      .subscribe(params => {
        var link="/ig-documents/igdocuments-edit/"+id;
        this.loading=false;
        this.router.navigate([link], params); // add the parameters to the end
      });



  }

}
