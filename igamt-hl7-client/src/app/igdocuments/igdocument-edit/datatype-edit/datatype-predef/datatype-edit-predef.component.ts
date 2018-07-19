/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {DatatypesService} from "../datatypes.service";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import * as _ from 'lodash';
import {MessageService} from "primeng/components/common/messageservice";



@Component({
  templateUrl : './datatype-edit-predef.component.html',
  styleUrls : ['./datatype-edit-predef.component.css']
})
export class DatatypeEditPredefComponent implements WithSave{
    currentUrl:any;
    datatypeId:any;
    datatypePredef:any;
    @ViewChild('editForm') editForm: NgForm;
    backup:any;

    constructor(private route: ActivatedRoute, private  router : Router, private datatypesService : DatatypesService, private messageService :MessageService){
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd ) {
                this.currentUrl=event.url;
            }
        });
    }

    ngOnInit() {
        this.datatypeId = this.route.snapshot.params["datatypeId"];
        this.datatypesService.getDatatypePreDef(this.datatypeId).then(data  => {
            this.datatypePredef = data;
          this.backup=_.cloneDeep(this.datatypePredef);

        });
    }

  reset(){
    this.datatypePredef=_.cloneDeep(this.backup);
    this.editForm.control.markAsPristine();

  }

  getCurrent(){
    return  this.datatypePredef;
  }

  getBackup(){
    return this.backup;
  }

  isValid(){
    return !this.editForm.invalid;
  }

  save(): Promise<any>{
    this.showError();
    return new Promise((resolve, reject)=> {

     this.datatypesService.saveDatatypePreDef(this.datatypeId, this.datatypePredef).then(saved => {

        this.backup = _.cloneDeep(this.datatypePredef);

        this.editForm.control.markAsPristine();
        resolve(true);

      }, error => {
        console.log("error saving");
        reject();

      }

    )});
  }

  showError() {
    console.log("test");
    this.messageService.add({severity:'success', summary:'Service Message', detail:'Via MessageService'});
  }

}
