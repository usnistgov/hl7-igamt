import {Component, Input, Output, EventEmitter} from "@angular/core";
import {DatatypesService} from "../../../igdocuments/igdocument-edit/datatype-edit/datatypes.service";
import {GeneralConfigurationService} from "../../../service/general-configuration/general-configuration.service";
import {IgDocumentService} from "../../../igdocuments/igdocument-edit/ig-document.service";
import { _ } from 'underscore';
import * as __ from 'lodash';

@Component({
  selector : 'datatype-col',
  templateUrl : './datatype-col.component.html',
  styleUrls : ['./datatype-col.component.css']
})

export class DatatypeColComponent {
  @Input() igId: any;
  @Input() ref: any;
  @Output() refChange = new EventEmitter<any>();
  @Input() datatypeLabel: any;
  @Output() datatypeLabelChange = new EventEmitter<any>();
  @Input() children: any[];
  @Output() childrenChange = new EventEmitter<any[]>();

  @Output() refresh = new EventEmitter<any>();

  @Input() idPath : string;
  @Input() path : string;
  @Input() viewScope : string;

  changeDTDialogOpen:boolean;
  currentDTLabel:any;
  datatypeLabels : any[];

  @Input() changeItems: any[];
  @Output() changeItemsChange = new EventEmitter<any[]>();

  cols: any[];

  constructor(private datatypesService : DatatypesService, private configService : GeneralConfigurationService, private igDocumentService : IgDocumentService){}

  ngOnInit(){
    this.changeDTDialogOpen = false;

    this.cols = [
      { field: 'scopeversion', header: 'Scope/Version' },
      { field: 'name', header: 'Name' },
      { field: 'ext', header: 'Ext' },
      { field: 'label', header: 'Label' }
    ];
  }

  makeEditModeForDatatype(){
    this.changeDTDialogOpen = true;
    this.currentDTLabel = __.cloneDeep(this.datatypeLabel);
    this.igDocumentService.getDatatypeLabels(this.igId).then((data) => {
      this.datatypeLabels = data;
    });
  }

  update(){
    this.ref.id = this.currentDTLabel.id;
    this.datatypeLabel = __.cloneDeep(this.currentDTLabel);
    this.updateChildren();
    this.changeDTDialogOpen = false;
    this.refChange.emit(this.ref);
    this.datatypeLabelChange.emit(this.datatypeLabel);
    let item:any = {};
    item.location = this.idPath;
    item.propertyType = 'DATATYPE';
    item.propertyValue = this.ref;
    item.changeType = "UPDATE";
    this.changeItems.push(item);
    this.changeItemsChange.emit(this.changeItems);

    this.datatypeLabels = null;
    this.currentDTLabel = null;
  }

  cancel(){
    this.datatypeLabels = null;
    this.currentDTLabel = null;
  }

  useThis(label){
    this.currentDTLabel = this.findDatatypeLabelById(label.id);
  }

  private updateChildren(){
    if(!this.datatypeLabel.leaf){
      this.datatypesService.getDatatypeStructureByRef(this.ref.id, this.idPath, this.path, this.viewScope).then((children) => {
        children = this.configService.arraySortByPosition(children);
        this.children = children;
        this.childrenChange.emit(this.children);
        this.refresh.emit(true);
      });
    }else {
      this.children = null;
      this.childrenChange.emit(this.children);
      this.refresh.emit(true);
    }
  }

  private findDatatypeLabelById(id){
    for(let label of this.datatypeLabels){
      if(label.id === id) return label;
    }
    return null;
  }
}