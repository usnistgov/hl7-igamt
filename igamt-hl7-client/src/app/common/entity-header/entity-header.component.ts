/**
 * Created by hnt5 on 10/30/17.
 */
import {Component, Input, EventEmitter,Output} from "@angular/core";
@Component({
  selector : 'entity-header',
  templateUrl : './entity-header.component.html',
  styleUrls : ['./entity-header.component.css']
})
export class EntityHeaderComponent {

  @Input()
  elm : any;
  @Input()
  hasChanged :boolean;
  @Input()
  canSave:boolean;
  sectionTypeDisplay : VisualRep;

  @Output() save = new EventEmitter<any>();

  @Output() reset = new EventEmitter<any>();

  saveParent() {
    this.save.emit(true);
  }
  resetParent(){
    this.reset.emit(true);
  }


  constructor(){}


  ngOnInit(){
    this.sectionTypeDisplay= this.createSectionTypeDisplay(this.elm);
  }
  createSectionTypeDisplay(elm:any){

    if(elm.sectionType=='PREDEF'){
      return new VisualRep("fa fa-mail-reply", "Pre Definition");

    }else if(elm.sectionType=='POSTDEF'){
      return new VisualRep( "fa fa-mail-forward","Post Definition");
    } else if (elm.sectionType=='METADATA'){
      return new VisualRep( "fa fa-edit","Meta Data");
    } else if (elm.sectionType=='STRUCTURE') {
      return new VisualRep( "fa fa-table","Structure");
    }else if(elm.sectionType=="CROSREFS"){
      return new VisualRep( "fa fa-list","Cross Reference");
    }else if(elm.sectionType=="CONFORMANCESTATEMENTS"){
      return new VisualRep( "fa fa-table","Conformance Statement");
    }else if(elm.sectionType=="CONFORMANCESTATEMENTS"){
      return new VisualRep( "fa fa-table","Conformance Statement");
    }else if(elm.sectionType=="COCONSTRAINTS"){
      return new VisualRep( "fa fa-table","Co-Constraints");
    }else if(elm.sectionType=="DYNAMICMAPPING"){
      return new VisualRep( "fa fa-table","Dynamic Mapping");
    }

  }
}

export class VisualRep{
  constructor(icon: string, text: string) {
    this.icon = icon;
    this.text = text;
  }
  public icon:string;
  public text:string;

}

