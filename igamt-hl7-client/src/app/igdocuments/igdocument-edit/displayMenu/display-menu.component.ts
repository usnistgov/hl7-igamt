/**
 * Created by ena3 on 4/23/18.
 */
import {Component, Input} from "@angular/core";
import {Router, ActivatedRoute, ParamMap, ActivatedRouteSnapshot} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {MenuItem} from "primeng/components/common/menuitem";
import {QueryParamsHandling} from "@angular/router/src/config";
@Component({
  selector : 'display-menu',
  templateUrl : './display-menu.component.html',
  styleUrls : ['./display-menu.component.css']
})
export class DisplayMenuComponent {
  @Input()
  elm : any;
  private items: MenuItem[];

  @Input()
  igId : any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ){


  }
  ngOnInit(){
      console.log(this.elm);


      if(this.elm.type=='SEGMENT' && this.elm.label=='OBX'){
        this.items=[
          {
            label: 'MetaData',
            icon: 'fa-file-o',
           command: (event) => {
              this.goTo(this.elm.type,"metadata");
              }
          },
          {
            label: 'Definition',
            icon: 'fa-edit',
            items: [
              {label: 'Pre Definition',   command: (event) => {
                this.goTo(this.elm.type,"preDef");
              }},
              {label: 'Structure',  command: (event) => {
                this.goTo(this.elm.type,"structure");
              }},
            {label: 'Post-Definition',  command: (event) => {
              this.goTo(this.elm.type,"postDef");
            }},
              {label:'Conformance Statement',  command: (event) => {
                this.goTo(this.elm.type,"conformanceStatement");
              }},
              {label:'Predicates' ,  command: (event) => {
                this.goTo(this.elm.type,"predicate");
              }}
            ]
          },
          {label: 'Cross-References', icon: 'fa-mail-reply'},


          {
            label: 'Actions',
            icon: 'fa-gear',
            items: [
              {
                label: 'Delete',
                icon: 'fa-remove',

              },
              {
                label: 'Copy',
                icon: 'fa-copy'
              }
            ]
          }
        ];
      }
      else if(this.elm.label=='OBX'&&this.elm.type!=='VALUESET' ){

        this.items=[
          {
            label: 'MetaData',
            icon: 'fa-file-o',
            command: (event) => {
              this.goTo(this.elm.type,"metadata");
            }
          },
          {
            label: 'Definition',
            icon: 'fa-edit',


            items: [
              {label: 'Pre Definition',   command: (event) => {
                this.goTo(this.elm.type,"preDef");
              }},
              {label: 'Structure',  command: (event) => {
                this.goTo(this.elm.type,"structure");
              }},
              {label: 'Post-Definition',  command: (event) => {
                this.goTo(this.elm.type,"postDef");
              }},
              {label:'Conformance Statement',  command: (event) => {
                this.goTo(this.elm.type,"conformanceStatement");
              }},
              {label:'Predicates' ,  command: (event) => {
                this.goTo(this.elm.type,"predicate");
              }}

            ]
          },
          {label: 'Cross-References', icon: 'fa-mail-reply'},


          {
            label: 'Actions',
            icon: 'fa-gear',
            items: [
              {
                label: 'Delete',
                icon: 'fa-remove',

              },
              {
                label: 'Copy',
                icon: 'fa-copy'
              }
            ]
          }
        ];
      }else{


        this.items=[
          {
            label: 'MetaData',
            icon: 'fa-file-o',
            command: (event) => {
              this.goTo(this.elm.type,"metadata");
            }
          },
          {
            label: 'Definition',
            icon: 'fa-edit',


            items: [
              {label: 'Pre Definition',   command: (event) => {
                this.goTo(this.elm.type,"preDef");
              }},
              {label: 'Structure',  command: (event) => {
                this.goTo(this.elm.type,"structure");
              }},
              {label: 'Post-Definition',  command: (event) => {
                this.goTo(this.elm.type,"postDef");
              }}

            ]
          },
          {label: 'Cross-References', icon: 'fa-mail-reply'},


          {
            label: 'Actions',
            icon: 'fa-gear',
            items: [
              {
                label: 'Delete',
                icon: 'fa-remove',

              },
              {
                label: 'Copy',
                icon: 'fa-copy'
              }
            ]
          }
        ];

      }

  }


  goTo(type,tab){
    type=type.toLowerCase();
    this.router.navigate(["./"+type+"/"+this.elm.key.id+"/"+tab],{ preserveQueryParams:true ,relativeTo:this.route, preserveFragment:true});

  }

  getStyle(label){


  }


}
