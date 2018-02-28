/**
 * Created by ena3 on 12/5/17.

 */
import {Component, Input} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {WorkspaceService, Entity} from "../../../service/workspace/workspace.service";


@Component({
  selector : 'datatype-edit',
  templateUrl : './datatype-edit.component.html',
  styleUrls : ['./datatype-edit.component.css']
})
export class DatatypeEditComponent {

  _datatype:any;
  datatypeEditTabs : any[];

  @Input() set datatype(datatype : any){
    this._datatype = datatype;
  }

  constructor(private _ws : WorkspaceService){
    this.datatype = _ws.getCurrent(Entity.DATATYPE);
  };

  ngOnInit(){
    this.datatype = this._ws.getCurrent(Entity.DATATYPE);

    this.datatypeEditTabs = [
      {label: 'Metadata', icon: 'fa-info-circle', routerLink:'./metadata'},
      {label: 'Definition', icon: 'fa-table', routerLink:'./definition'},
      {label: 'Delta', icon: 'fa-table', routerLink:'./delta'},
      {label: 'Cross-Reference', icon: 'fa-link', routerLink:'./crossref'}
    ];
  }

}
