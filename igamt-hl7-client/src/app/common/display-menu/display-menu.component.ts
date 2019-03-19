/**
 * Created by ena3 on 4/23/18.
 */
import {Component, Input} from "@angular/core";
import {Router, ActivatedRoute, ParamMap, ActivatedRouteSnapshot} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {SubMenu} from "./SubMenu";
@Component({
  selector : 'display-menu',
  templateUrl : './display-menu.component.html',
  styleUrls : ['./display-menu.component.css']
})
export class DisplayMenuComponent {
  @Input()
  elm : any;
  private items: SubMenu[];

  @Input()
  igId : any;

  activeId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router){
  }


  ngOnInit(){
      console.log(this.elm);
      if(this.elm.type){
       this.items= this.getMenuItems();

        }
      }

  goTo(item:SubMenu){
    let type=this.elm.type.toLowerCase();
    this.activeId=item.id;
    console.log(item);

    console.log(this.activeId);
    this.router.navigate(["./"+type+"/"+this.elm.id+"/"+item.value],{ preserveQueryParams:true ,relativeTo:this.route, preserveFragment:true});

  }

  getUrl(item:SubMenu){

    let type=this.elm.type.toLowerCase();
    return "./"+type+"/"+this.elm.id+"/"+item.value;
  }

  getMenuItems(){
    let ret :SubMenu[]=[];
    let type = this.elm.type.toLowerCase();
    ret.push( new SubMenu("metadata"+"/"+this.elm.id,"metadata","Meta Data", "fa fa-edit"));

    ret.push(new SubMenu("preDef"+"/"+this.elm.id,"preDef","Pre Definition", "fa fa-mail-reply"));



    ret.push(new  SubMenu("structure"+"/"+this.elm.id,"structure","Structure", "fa fa-table"));

    ret.push(new SubMenu("postDef"+"/"+this.elm.id,"postDef","Post Definition", "fa fa-mail-forward"));

    ret.push(new SubMenu("conformanceStatement"+"/"+this.elm.id,"conformanceStatement","Conformance Statement", "fa fa-table"));

    if(type=='segment'&& this.elm.label=="OBX"){

      ret.push( new SubMenu("coConstraint"+"/"+this.elm.id,"coConstraint","Co-Constraint", "fa fa-table"));

     // ret.push( new SubMenu("dynamicMapping"+"/"+this.elm.id,"dynamicMapping","Dynamic Mapping", "fa fa-table"));

    }

   ret.push(  new SubMenu("crossRef"+"/"+this.elm.id,"crossRef","Cross Reference", "fa fa-list"));


  return ret;

  }






}
