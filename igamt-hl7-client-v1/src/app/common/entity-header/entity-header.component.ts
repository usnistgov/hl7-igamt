/**
 * Created by hnt5 on 10/30/17.
 */
import {Component, Input, EventEmitter, Output} from "@angular/core";
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector : 'entity-header',
  templateUrl : './entity-header.component.html',
  styleUrls : ['./entity-header.component.css']
})
export class EntityHeaderComponent {

  @Input() elm: any;
  @Input() hasChanged: boolean;
  @Input() canSave: boolean;
  sectionTypeDisplay: VisualRep;
  _differential: boolean;
  _delta: boolean;

  @Output() save = new EventEmitter<any>();
  @Output() reset = new EventEmitter<any>();
  @Output() diff = new EventEmitter<boolean>();

  constructor(private router: Router, private route: ActivatedRoute) {}

  goToDIff(bool: boolean) {
    if (bool) {
      this.router.navigate(['../delta'], { relativeTo: this.route });
    } else {
      this.router.navigate( ['../structure'], { relativeTo: this.route });
    }
  }

  saveParent() {
    this.save.emit(true);
  }
  resetParent(){
    this.reset.emit(true);
  }

  @Input()
  set differential(diff: boolean) {
    this._delta = diff;
  }

  @Input()
  set diffToggled(diff: boolean) {
    this._differential = diff;
  }

  toggle(event) {
    this.goToDIff(!this._differential);
  }


  ngOnInit(){
    this.sectionTypeDisplay= this.createSectionTypeDisplay(this.elm);
  }
  createSectionTypeDisplay(elm:any){
    if(elm){



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

  }}
}

export class VisualRep{
  constructor(icon: string, text: string) {
    this.icon = icon;
    this.text = text;
  }
  public icon:string;
  public text:string;

}

