/**
 * Created by Jungyub on 10/23/17.
 */
import {Component, ViewChild, TemplateRef} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import 'rxjs/add/operator/filter';
import {GeneralConfigurationService} from "../../../../service/general-configuration/general-configuration.service";
import {ConstraintsService} from "../../service/constraints.service";
import { _ } from 'underscore';
import * as __ from 'lodash';
import {TocService} from "../../service/toc.service";
import {DatatypesService} from "../datatypes.service";
import {WithSave} from "../../../../guards/with.save.interface";
import {NgForm} from "@angular/forms";
import {Columns} from "../../../../common/constants/columns";
import {Types} from "../../../../common/constants/types";

@Component({
  selector : 'datatype-edit',
  templateUrl : './datatype-edit-structure.component.html',
  styleUrls : ['./datatype-edit-structure.component.css']
})

export class DatatypeEditStructureComponent implements WithSave{
  currentUrl:any;
  datatypeId:any;
  igId:any;
  datatypeStructure:any;
  changeItems:any[];
  backup:any;

  @ViewChild('editForm')
  private editForm: NgForm;

  cols= Columns.dataTypeColumns;
  selectedColumns=Columns.dataTypeColumns;
  documentType=Types.IGDOCUMENT;

  constructor(private route: ActivatedRoute,
              private router : Router,
              private configService : GeneralConfigurationService,
              private datatypesService : DatatypesService, private tocService: TocService){
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
        this.currentUrl=event.url;
      }
    });
  }

  ngOnInit() {
    this.changeItems = [];
    this.datatypeId = this.route.snapshot.params["datatypeId"];
    this.igId = this.router.url.split("/")[2];
    this.route.data.map(data =>data.datatypeStructure).subscribe(x=>{
      x.structure = this.configService.arraySortByPosition(x.structure);
      this.datatypeStructure = {};
      this.datatypeStructure = x;
      this.backup=__.cloneDeep(this.datatypeStructure);
    });
  }

  reset(){
    this.datatypeStructure=__.cloneDeep(this.backup);
    this.editForm.control.markAsPristine();
  }

  getCurrent(){
    return  this.datatypeStructure;
  }

  getBackup(){
    return this.backup;
  }

  canSave(){

    return !this.datatypeStructure.readOnly;

  }

  save(){
    return new Promise((resolve, reject)=> {
      this.datatypesService.save(this.datatypeId, this.changeItems).then(saved => {
        this.backup = __.cloneDeep(this.datatypeStructure);
        this.changeItems = [];
        this.editForm.control.markAsPristine();
        resolve(true);

      }, error => {

        reject(error);
      });
    })
  }

  refreshTree(){
    this.datatypeStructure.structure = [...this.datatypeStructure.structure];
  }

  reorderCols(){
    this.selectedColumns= __.sortBy(this.selectedColumns,['position']);
  }
  hasChanged(){
    return this.changeItems!=null&& this.changeItems.length>0;
  }

  print(node){
    console.log(node);
  }
}
