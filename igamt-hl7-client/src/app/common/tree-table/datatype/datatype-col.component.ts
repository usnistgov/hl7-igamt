import {Component, Input, Output, EventEmitter} from "@angular/core";
import {DatatypesService} from "../../../igdocuments/igdocument-edit/datatype-edit/datatypes.service";
import {GeneralConfigurationService} from "../../../service/general-configuration/general-configuration.service";

@Component({
  selector : 'datatype-col',
  templateUrl : './datatype-col.component.html',
  styleUrls : ['./datatype-col.component.css']
})

export class DatatypeColComponent {
  @Input() ref: any;
  @Output() refChange = new EventEmitter<any>();
  @Input() datatypeLabel: any;
  @Output() datatypeLabelChange = new EventEmitter<any>();
  @Input() children: any[];
  @Output() childrenChange = new EventEmitter<any[]>();

  @Output() refresh = new EventEmitter<any>();

  @Input() idPath : string;
  @Input() path : string;
  @Input() datatypeLabels : any[];
  @Input() viewScope : string;

  edit:boolean;
  relatedDatatypeLabels:any[];
  changeDTDialogOpen:boolean;

  constructor(private datatypesService : DatatypesService, private configService : GeneralConfigurationService){}

  ngOnInit(){
    this.edit = false;
    this.changeDTDialogOpen = false;
  }

  makeEditModeForDatatype(){
    this.edit = true;
    this.relatedDatatypeLabels = [];
    for(let label of this.datatypeLabels){
      if(label.name === this.datatypeLabel.name){
        label.value = label.id;
        this.relatedDatatypeLabels.push(label);
      }
    }
    this.relatedDatatypeLabels.push({id:null, value:this.datatypeLabel.id});
  }

  editDatatype(){
    for(let label of this.datatypeLabels){
      label.value = label.id;
    }
    this.changeDTDialogOpen = true;
    this.edit = false;
  }

  onDatatypeChangeForDialog(){
    this.datatypeLabel = this.findDatatupeLabelById(this.ref.id);
    this.updateChildren();
    this.changeDTDialogOpen = false;
    this.edit = false;
    this.refChange.emit(this.ref);
    this.datatypeLabelChange.emit(this.datatypeLabel);
  }

  onDatatypeChange(){
    this.datatypeLabel = this.findDatatupeLabelById(this.ref.id);
    this.updateChildren();
    this.refChange.emit(this.ref);
    this.datatypeLabelChange.emit(this.datatypeLabel);
    this.edit = false;

  }

  private updateChildren(){
    if(!this.datatypeLabel.leaf){
      this.datatypesService.getDatatypeStructureByRef(this.ref.id, this.idPath, this.path, this.viewScope).then((children) => {
        children = this.configService.arraySortByPosition(children);
        console.log(children);
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

  private findDatatupeLabelById(id){
    for(let label of this.datatypeLabels){
      if(label.id === id) return label;
    }
    return null;
  }
}