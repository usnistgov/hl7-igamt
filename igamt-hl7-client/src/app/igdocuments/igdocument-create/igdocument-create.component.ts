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
import {BreadcrumbService} from "../../breadcrumb.service";


@Component({
  templateUrl: './igdocument-create.component.html'
})
export class IgDocumentCreateComponent {
  isLinear = true;
  tableValue :any;
  tableValueMap={};
  loading=false;
  uploadedFiles: any[] = [];
  activeIndex: number = 0;
  selectedVerion:any;
  blockUI=false;

  metaData: any= {};
  items: MenuItem[];
  breadCurmp:MenuItem[];
  path: MenuItem[];

  selectdNodeMap={};
  selectedNodes: TreeNode[];
  firstFormGroup: FormGroup;
  msgEvts=[];
  messageEventMap={};
  secondFormGroup: FormGroup;
  // @ViewChild('stepper') private myStepper: MatStepper;
  hl7Versions: any[];
  selcetedVersion: any =null;

  constructor(private _formBuilder: FormBuilder,private createService :IgDocumentCreateService,
              private router: Router,    private route: ActivatedRoute, private ws :  WorkspaceService, private  breadCrump:BreadcrumbService
  ) {
    this.path=[{label:"Igdocuments"},{label:"create new IG document"}];
    this.breadCrump.setItems(this.path);
    this.hl7Versions=ws.getAppConstant().hl7Versions;
  }

  ngOnInit() {

    this.items = [
      {
      label: 'Meta Data ',

      },
      {
        label: 'Conformane Profiles'
      }

      ];




    this.breadCurmp = [
      {
        label: 'IG Documents ',

      },
      {
        label: 'Create New IG Document'
      }

    ];



  }


  totalStepsCount: number;


  getMessages(v){
    this.tableValue=[];
    this.selectedVerion=v;
    console.log(v);
    if(this.tableValueMap[v]){


      this.tableValue=this.tableValueMap[this.selectedVerion];
      if(this.selectdNodeMap[v]){
        this.selectdNodeMap[this. selcetedVersion]=this.selectdNodeMap[v];

      }

    }else{
      this.createService.getMessagesByVersion(v).subscribe(x=>{

        console.log(this.selectedVerion);
        this.tableValue=x;
        this.tableValueMap[this.selectedVerion]= this.tableValue;
        this.selectdNodeMap[this.selectedVerion]=this.selectdNodeMap[this. selcetedVersion];
      })

    }

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
    for(let i=0 ;i<this.selectdNodeMap[this. selcetedVersion].length; i++){
      if(this.selectdNodeMap[this. selcetedVersion][i].data.parentStructId){
        if(this.selectdNodeMap[this. selcetedVersion][i].parent.data.id){
          if(this.messageEventMap[this.selectdNodeMap[this. selcetedVersion][i].parent.data.id]){
            if(this.messageEventMap[this.selectdNodeMap[this. selcetedVersion][i].parent.data.id].children) {
              this.messageEventMap[this.selectdNodeMap[this. selcetedVersion][i].parent.data.id].children.push({
                name:this.selectdNodeMap[this. selcetedVersion][i].data.name,
                parentStructId:this.selectdNodeMap[this. selcetedVersion][i].parent.data.structId


              });
            }else{
              this.messageEventMap[this.selectdNodeMap[this. selcetedVersion][i].parent.data.id].children=[];
              this.messageEventMap[this.selectdNodeMap[this. selcetedVersion][i].parent.data.id].children.push({
                name:this.selectdNodeMap[this. selcetedVersion][i].data.name,
                parentStructId:this.selectdNodeMap[this. selcetedVersion][i].parent.data.structId


              })
            }
          }else{
            this.messageEventMap[this.selectdNodeMap[this. selcetedVersion][i].parent.data.id]={};
            this.messageEventMap[this.selectdNodeMap[this. selcetedVersion][i].parent.data.id].children=[];
            this.messageEventMap[this.selectdNodeMap[this. selcetedVersion][i].parent.data.id].children.push({
              name:this.selectdNodeMap[this. selcetedVersion][i].data.name,
              parentStructId:this.selectdNodeMap[this. selcetedVersion][i].parent.data.structId

            })


          }
        }

      }
    }
   this.msgEvts=Object.keys(this.messageEventMap).map((key)=>{ return {id:key, children:this.messageEventMap[key].children}});

    console.log(this.msgEvts);

  }


  create(){
    let wrapper:any ={};


  let versions= Object.keys(this.selectdNodeMap);


    for(let i = 0 ; i<versions.length; i++){
      let version = versions[i];
      console.log(this.selectdNodeMap[version]);
      for(let j =0 ; j<this.selectdNodeMap[version].length; j++){
        this.selectNode(this.selectdNodeMap[version][j]);
      }

  };

  wrapper.msgEvts=this.msgEvts;
  wrapper.metaData=this.metaData;
  this.blockUI=true;


    this.createService.createIntegrationProfile(wrapper).subscribe(
      res => {
         console.log(res);
         this.goTo(res);
         this.blockUI=false;
      }
    )


  };

  convertNodeToData(){



  }

  goTo(res:any) {


    this.route.queryParams
      .subscribe(params => {
        var link="/ig/"+res.id;
        this.loading=false;
        this.router.navigate([link], params); // add the parameters to the end
      });



  }

  print(obj){

    console.log(obj);
    // this.submitEvent();
    // this.getMessages();
  }

  selectEvent(event){
    this.selectNode(event.node);

  }
  selectNode(node){

    if(node.children&& node.children.length>0){
    }else {
      this.msgEvts.push(node.data);
    }
  }

  unselectEvent(event){

    this.unselectNode(event.node);
  }


  unselectNode(node){
    if(node.children&& node.children.length>0){
      for(let i=0;i<node.children.length;i++){
        this.unselectdata(node.children[i].data);
      }
    }else {
      this.unselectdata(node.data);
    }
  };


  unselectdata(data){
    let index = this.msgEvts.indexOf(data);
    if(index >-1){
      this.msgEvts.splice(index,1);
    }

  }

  next(ev){
    console.log("call next")
    this.activeIndex=1;

  }
  previous(ev){

    console.log("call previous")
    this.activeIndex=0;

  }

  unselect(selected :any){
    console.log(selected);

    let index = this.selectdNodeMap[this.selcetedVersion].indexOf(selected);
    if(index >-1){
      this.selectdNodeMap[this.selcetedVersion].splice(index,1);
      if(selected.parent){
        this.unselectParent(selected.parent);
      }
    }
  }

  unselectParent(parent){

    parent.partialSelected=this.getPartialSelection(parent);
    console.log(parent.partialSelected);
    this.unselect(parent);

  }

  getPartialSelection(parent){
    for(let i=0; i<parent.children.length; i++){
      if(this.selectdNodeMap[this.selcetedVersion].indexOf(parent.children[i])>-1){
        return true;
      }
    }
    return false;
  }




  getSelected(){
    let ret=[];

    let versions= Object.keys(this.selectdNodeMap);
    if(versions.length>0){
      for(let i = 0 ; i<versions.length; i++) {
        let version = versions[i];
        if (this.selectdNodeMap[version]){
          for (let j = 0; j < this.selectdNodeMap[version].length; j++) {
            if(this.selectdNodeMap[version][j].parent){
              ret.push(this.selectdNodeMap[version][j])

            }
          }
      }
      };
    }

    return ret;


  }

  upload(event) {
    this.metaData.coverPicture =JSON.parse(event.xhr.response).link;

    for(let file of event.files) {
      this.uploadedFiles.push(file);

    }


  }




}
