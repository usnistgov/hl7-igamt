import { Component, OnInit } from '@angular/core';
import {PrimeDialogAdapter} from "../../../common/prime-ng-adapters/prime-dialog-adapter";
import {WorkspaceService} from "../../../service/workspace/workspace.service";
import {ActivatedRoute, Router} from "@angular/router";
import {IgDocumentAddingService} from "../../igdocument-edit/service/adding.service";
import * as _ from 'lodash';
import {IgErrorService} from "../ig-error/ig-error.service";
@Component({
  selector: 'app-add-value-set',
  templateUrl: './add-value-set.component.html',
  styleUrls: ['./add-value-set.component.css']
})
export class AddValueSetComponent extends PrimeDialogAdapter {

  hl7Versions: any[];
  id="";
  sources: any;
  dest: any[] = [];
  namingIndicators = [];


  constructor(private  addingService: IgDocumentAddingService,
              private router: Router, private route: ActivatedRoute, private ws: WorkspaceService, private igErrorService:IgErrorService) {
    super();
    this.hl7Versions = ws.getAppConstant().hl7Versions;

  }

  ngOnInit() {
    // Mandatory
    super.hook(this);
  }


  onDialogOpen() {
    // Init code
    this.sources = []
    this.dest = [];
  }

  close() {
    this.dismissWithNoData();
  }

  closeWithData(data: any) {
    this.dismissWithData(data);
  }

  getSource(version) {
    console.log(this.namingIndicators);

    this.addingService.getHl7ValueSetsByVersion(version).subscribe(x => {
      this.sources = x;

    });

  }

  addAsIs(elm) {
    var copy =_.cloneDeep(elm);
    let x: any = {};
    x.domainInfo = copy.domainInfo;
    x.name = copy.bindingIdentifier;
    x.flavor = false;
    x.description = copy.name;
    x.id=copy.id;
    this.dest.push(x);

  }

  addAsFlavor(elm) {

    let x: any = {};
    var copy =_.cloneDeep(elm);

    x.domainInfo =copy.domainInfo;
    x.domainInfo.scope = "USER";
    x.name = copy.bindingIdentifier;
    x.ext = "";
    x.flavor = true;
    x.description = copy.name;
    x.id=copy.id;
    this.dest.push(x);
  }

  remove(elm) {
    let index = this.dest.indexOf(elm);
    if (index > -1) {
      this.dest.splice(index, 1);
    }
  }

  getScopeLabel(elm) {

    let scope =elm.domainInfo.scope;
    if (scope === 'HL7STANDARD') {
      return 'HL7';
    } else if (scope === 'USER') {
      return 'USR';
    } else if (scope === 'MASTER') {
      return 'MAS';
    } else if (scope=== 'PRELOADED') {
      return 'PRL';
    } else if (scope === 'PHINVADS') {
      return 'PVS';
    } else {
      return null ;
    }

  }
  submit(){


    let wrapper:any ={};
    wrapper.toAdd=this.dest;
    wrapper.id=this.id;
    this.addingService.addValueSets(wrapper).subscribe(
      res => {
        console.log(res);
        this.closeWithData(res);
      }, error=>{
        this.igErrorService.showError(error);
      }
    )


  }

}
