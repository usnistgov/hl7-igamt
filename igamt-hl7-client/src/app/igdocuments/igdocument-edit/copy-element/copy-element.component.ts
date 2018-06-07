import { Component, OnInit } from '@angular/core';
import {PrimeDialogAdapter} from "../../../common/prime-ng-adapters/prime-dialog-adapter";
import {WorkspaceService} from "../../../service/workspace/workspace.service";
import {ActivatedRoute, Router} from "@angular/router";
import * as _ from 'lodash';
@Component({
  selector: 'app-copy-element',
  templateUrl: './copy-element.component.html',
  styleUrls: ['./copy-element.component.css']
})
export class CopyElementComponent extends PrimeDialogAdapter{
  igDocumentId="";
  name="";
  ext="";
  wrapper={};
  namingIndicators = [];


  constructor(private router: Router, private route: ActivatedRoute, private ws: WorkspaceService) {
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
  console.log(this.namingIndicators);
  console.log(this.name);
  console.log(this.ext);

  }
}
