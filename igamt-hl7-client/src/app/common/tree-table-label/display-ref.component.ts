/**
 * Created by hnt5 on 10/26/17.
 */
import {Component, Input} from "@angular/core";
import {Router, ActivatedRoute, ParamMap, ActivatedRouteSnapshot} from '@angular/router';
import 'rxjs/add/operator/switchMap';
@Component({
  selector : 'display-ref',
  templateUrl : './display-ref.component.html',
  styleUrls : ['./display-ref.component.css']
})
export class DisplayRefComponent {
  _elm : any;
  _ig : any;

  @Input()
  igId : any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ){
  }
  ngOnInit(){

  }

  @Input() set elm(obj){
    this._elm = obj;
  }

  get elm(){
    return this._elm;
  }

  getScopeLabel() {
    if (this.elm.domainInfo && this.elm.domainInfo.scope) {
      let scope = this.elm.domainInfo.scope;
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

    return null;
  }

  getElementLabel(){
    return this.elm.label;
  }

  getVersion(){
    return this.elm.domainInfo.version ? this.elm.domainInfo.version : '';
  };
}
