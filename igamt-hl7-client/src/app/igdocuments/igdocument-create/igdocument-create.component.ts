/**
 * Created by ena3 on 12/29/17.
 */
import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// import {MatStepper} from "@angular/material";
import {IgDocumentCreateService} from "./igdocument-create.service";
import {TreeNode} from "primeng/components/common/treenode";
import {WorkspaceService} from "../../service/workspace/workspace.service";
import {Router, ActivatedRoute} from "@angular/router";
import {MenuItem} from 'primeng/api';


@Component({
  templateUrl: './igdocument-create.component.html'
})
export class IgDocumentCreateComponent {
  isLinear = true;
  tableValue :any;
  loading=false;
  activeIndex: number = 1;
  selectedVerion:any;

  metaData= {
    title:"",
    subTitle:"",
    organization:""
  };
  items: MenuItem[];


  selectedNodes: TreeNode[];
  firstFormGroup: FormGroup;
  msgEvts=[];
  messageEventMap={};
  secondFormGroup: FormGroup;
  // @ViewChild('stepper') private myStepper: MatStepper;
  hl7Versions: any[];
  selcetedVersion: any;

  constructor(private _formBuilder: FormBuilder,private createService :IgDocumentCreateService,
              private router: Router,    private route: ActivatedRoute, private ws :  WorkspaceService
  ) {

    this.hl7Versions=ws.getAppConstant().hl7Versions;
  }

  ngOnInit() {

    this.items = [{
      label: 'Meta Data ',
      command: (event: any) => {
        this.activeIndex = 0;
      }
    },
      {
        label: 'Conformane Profiles',
        command: (event: any) => {
          this.activeIndex = 1;
        }
      }];





  }


  totalStepsCount: number;


  getMessages(v){
    this.tableValue=[];
    console.log(v);
    console.log(v);
    this.createService.getMessagesByVersion(v).subscribe(x=>{

      console.log(this.selectedVerion);

      this.tableValue=x;
    })
  }

  // load(){
  //   console.log(this.selectedNodes);
  //   this.selectedNodes=[];
  //   this.getMessages(this.selcetedVersion);
  // }

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

    console.log(this.msgEvts);

  }


  create(){
    this.loading=true;
    this.submitEvent();
  let wrapper:any ={};


  wrapper.msgEvts=this.msgEvts;
  wrapper.metaData=this.metaData;
  wrapper.hl7Version=this.selcetedVersion;

    this.createService.createIntegrationProfile(wrapper).subscribe(
      res => {

        // this.goTo(res.id);
      }
    )


  };

  goTo(id) {


    this.route.queryParams
      .subscribe(params => {
        var link="/ig/"+id;
        this.loading=false;
        this.router.navigate([link], params); // add the parameters to the end
      });



  }

  print(obj){

    console.log(obj);
    // this.submitEvent();
    // this.getMessages();
  }

  selectNode(event){
    let node=event.node;

    if(node.children&& node.children.length>0){
      for(let i=0;i<node.children.length;i++){

        let index = this.msgEvts.indexOf(node.children[i].data);
        if(index<0){
          this.msgEvts.push(node.children[i].data);
        }
      }
    }else {
      this.msgEvts.push(node.data);
    }
  }

  unselectNode(event){
    if(event.node.children&& event.node.children.length>0){
      for(let i=0;i<event.node.children.length;i++){
        this.unselectdata(event.node.children[i].data);
      }
    }else {
      this.unselectdata(event.node.data);
    }

  }

  unselectdata(data){
    let index = this.msgEvts.indexOf(data);
    if(index >-1){
      this.msgEvts.splice(index,1);
    }

  }


}
