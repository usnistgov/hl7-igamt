/**
 * Created by hnt5 on 10/26/17.
 */
import {Component, Input} from "@angular/core";
import 'rxjs/add/operator/switchMap';
@Component({
  selector : 'display-constantvalue',
  templateUrl : './display-constantvalue.component.html',
  styleUrls : ['./display-constantvalue.component.css']
})
export class DisplayConstantValueComponent {
  _elm : any;
  _from : string;

  constructor(){}
  ngOnInit(){

  }

  @Input() set elm(obj){
    this._elm = obj;
  }

  get elm(){
    return this._elm;
  }

  @Input() set from(obj){
    this._from = obj;
  }

  get from(){
    return this._from;
  }
}
