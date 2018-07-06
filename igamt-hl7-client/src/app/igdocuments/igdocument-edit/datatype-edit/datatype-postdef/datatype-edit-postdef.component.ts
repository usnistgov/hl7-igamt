/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {DatatypesService} from "../datatypes.service";
import {NgForm} from "@angular/forms";
import * as _ from 'lodash';



@Component({
  templateUrl : './datatype-edit-postdef.component.html',
  styleUrls : ['./datatype-edit-postdef.component.css']
})
export class DatatypeEditPostdefComponent {
    currentUrl:any;
    datatypeId:any;
    datatypePostdef:any;
    @ViewChild('editForm') editForm: NgForm;
    backup:any;


  constructor(private route: ActivatedRoute, private  router : Router, private datatypesService : DatatypesService){
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd ) {
                this.currentUrl=event.url;
            }
        });
    }

    ngOnInit() {
        this.datatypeId = this.route.snapshot.params["datatypeId"];
        this.datatypesService.getDatatypePostDef(this.datatypeId).then( data  => {
            this.datatypePostdef = data;
            this.backup=_.cloneDeep(this.datatypePostdef);
        });
    }

  reset(){
    this.datatypePostdef=_.cloneDeep(this.backup);
    this.editForm.control.markAsPristine();

  }

  getCurrent(){
    return  this.datatypePostdef;
  }

  getBackup(){
    return this.backup;
  }

  isValid(){
    return !this.editForm.invalid;
  }

  save(): Promise<any>{

    return new Promise((resolve, reject)=> {

      return this.datatypesService.saveDatatypePreDef(this.datatypeId, this.datatypePostdef).then(saved => {

        this.backup = _.cloneDeep(this.datatypePostdef);

        this.editForm.control.markAsPristine();
        resolve(true);

      }, error => {
        console.log("error saving");
        reject();

      }

    );
  })}
}
