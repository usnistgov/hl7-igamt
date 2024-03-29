/**
 * Created by hnt5 on 10/26/17.
 */
import {Component, Input} from "@angular/core";
import {Router, ActivatedRoute, ParamMap, ActivatedRouteSnapshot} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {Types} from "../constants/types";
@Component({
  selector : 'display-label',
  templateUrl : './display-label.component.html',
  styleUrls : ['./display-label.component.css']
})
export class DisplayLabelComponent {
  _elm : any;
  _redirect : boolean = true;
  @Input()
  igId : any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ){

  }

  ngOnInit(){

  }

  @Input() set redirect(bool){
    this._redirect = bool;
  }

  @Input() set elm(obj){
    this._elm = obj;
  }

  get elm(){
    return this._elm;
  }

  getScopeLabel() {
    if(this.elm.type=='TEXT'){
      return null;

    }
    if (this.elm.domainInfo && this.elm.domainInfo.scope) {
      let scope = this.elm.domainInfo.scope;
      if (scope === 'HL7STANDARD') {
        return 'HL7';
      } else if (scope === 'USER') {
        return 'USR';
      } else if (scope === 'SDTF') {
        return 'SDTF';
      } else if (scope=== 'PRELOADED') {
        return 'PRL';
      } else if (scope === 'PHINVADS') {
        return 'PVS';
      } else {
        return null ;
      }
    }
  }

  getElementLabel(){

      var type =this.elm.type;

      if(type==Types.TEXT){
        return this.elm.label;
      }else{
        return this.getLabel(this.elm);
      }

  }

  getVersion(){
    return this.elm.domainInfo.version ? this.elm.domainInfo.version : '';
  };
  getLabel(elm){
    if(!elm.ext || elm.ext==''){
      return elm.label+"-"+elm.description;
    }else{
      return elm.label+"_"+elm.ext+"-"+elm.description;
    }
  };

  getDatatypeLabel(elm){
    if(!elm.ext || elm.ext==''){
      return elm.label+"-"+elm.description;
    }else{
      return elm.label+"_"+elm.ext+elm.description;
    }
  };
  getTableLabel(elm){
    return elm.bindingIdentifier+"-"+elm.label;

  };

  getMessageLabel(elm){
    return elm.label+"-"+elm.description;
  };
  getProfileComponentsLabel(elm){
    return elm.label+"-"+elm.ext;

  };

  getCompositeProfileLabel(elm){
    return elm.label+"-"+elm.description;


  };

  doRedirect() {
    if (this._redirect) {
      this.goTo();
    }
  }

  goTo() {
    console.log(this.elm);
    var type=this.elm.type.toLowerCase();
    let id ="";
    if(type=='text'){
      type="section";
      id=this.elm.id;

    }else{
     id= this.elm.id;
    }
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // {order: "popular"}

        this.router.navigate(["./"+type+"/"+this.elm.id],{ preserveQueryParams:true ,relativeTo:this.route, preserveFragment:true});

      });
  }





}
