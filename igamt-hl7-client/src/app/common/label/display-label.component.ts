/**
 * Created by hnt5 on 10/26/17.
 */
import {Component, Input} from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import {WorkspaceService, Entity} from "../../service/workspace/workspace.service";

@Component({
  selector : 'display-label',
  templateUrl : './display-label.component.html',
  styleUrls : ['./display-label.component.css']
})
export class DisplayLabelComponent {
  _elm : any;
  _ig : any;


  constructor(
    private _ws : WorkspaceService,
    private route: ActivatedRoute,
    private router: Router


  ){}
  ngOnInit(){
   this._ws.getCurrent(Entity.IG).subscribe(data=>{this._ig=data});

  }

  @Input() set elm(obj){
    this._elm = obj;
  }

  get elm(){
    return this._elm;
  }

  getScopeLabel() {

    if (this.elm &&this.elm.scope) {
      if (this.elm.scope === 'HL7STANDARD') {
        return 'HL7';
      } else if (this.elm.scope === 'USER') {
        return 'USR';
      } else if (this.elm.scope === 'MASTER') {
        return 'MAS';
      } else if (this.elm.scope === 'PRELOADED') {
        return 'PRL';
      } else if (this.elm.scope === 'PHINVADS') {
        return 'PVS';
      } else {
        return null ;
      }
    }
  }

  getElementLabel(){
    var type =this.elm.type;
    if(type){
      if (type === 'segment') {
        return this.getSegmentLabel(this.elm);
      } else if (type='datatype') {
        return this.getDatatypeLabel(this.elm);
      } else if (type==='table') {
        console.log("Called");
        return this.getTableLabel(this.elm);
      } else if (type ==='message') {
        return this.getMessageLabel(this.elm);
      } else if (type === 'profilecomponent') {
        return this.getProfileComponentsLabel(this.elm);
      } else if(type ==='compositeprofile'){
        return this.getCompositeProfileLabel(this.elm);
      }
    }
  }

  getVersion(){
    return this.elm.hl7Version ? this.elm.hl7Version : '';
  };
  getSegmentLabel(elm){
    if(!elm.ext || elm.ext==''){
      return elm.name+"-"+elm.description;
    }else{
      return elm.name+"_"+elm.ext+elm.description;
    }
  };

  getDatatypeLabel(elm){
    if(!elm.ext || elm.ext==''){
      return elm.name+"-"+elm.description;
    }else{
      return elm.name+"_"+elm.ext+elm.description;
    }
  };
  getTableLabel(elm){
    return elm.bindingIdentifier+"-"+elm.name;


  };

  getMessageLabel(elm){
    return elm.name+"-"+elm.description;



  };
  getProfileComponentsLabel(elm){
    return elm.name+"-"+elm.description;

  };

  getCompositeProfileLabel(elm){
    return elm.name+"-"+elm.description;


  };

  goTo() {
    var type=this.elm.type;
    var IgdocumentId=this._ig.id;

    this.route.queryParams
      .subscribe(params => {
        console.log(params); // {order: "popular"}


        var link="/ig-documents/igdocuments-edit/"+IgdocumentId+"/"+this.elm.type+"/"+this.elm.id;
        this.router.navigate([link], params); // add the parameters to the end
      });



  }


}
