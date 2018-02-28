/**
 * Created by hnt5 on 10/30/17.
 */
import {Component, Input} from "@angular/core";
@Component({
  selector : 'entity-header',
  templateUrl : './entity-header.component.html',
  styleUrls : ['./entity-header.component.css']
})
export class EntityHeaderComponent {
  _elm : any;

  constructor(){}

  @Input() set elm(e){
    this._elm = e;
  }

  header(){
    switch (this._elm.type){
      case 'segment' :
        return this._elm.label;
      case 'document' :
        return this._elm.metaData.title;
    }
    return 'ndef';
  }
  ngOnInit(){}
}
