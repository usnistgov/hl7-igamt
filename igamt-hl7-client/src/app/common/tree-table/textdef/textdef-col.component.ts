import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector : 'textdef-col',
  templateUrl : './textdef-col.component.html',
  styleUrls : ['./textdef-col.component.css']
})

export class TextdefColComponent {
  @Input() text: string;
  @Output() textChange = new EventEmitter<string>();

  @Input() idPath : string;
  @Input() changeItems: any[];
  @Output() changeItemsChange = new EventEmitter<any[]>();

  backup:any;
  textdefEditDialogOpen:boolean = false;

  constructor(){}

  ngOnInit(){
  }

  editTextDefBindings(){
    this.textdefEditDialogOpen = true;
    this.backup = this.text;
  }

  deleteTextDef(){
    this.text = null;
    this.updateTextDef();
  }

  updateTextDef(){
    this.textChange.emit(this.text);

    let item:any = {};
    item.location = this.idPath;
    item.propertyType = 'DEFINITIONTEXT';
    item.propertyValue = this.text;
    item.changeType = "UPDATE";
    this.changeItems.push(item);
    this.changeItemsChange.emit(this.changeItems);
  }

  resetTextDef(){
    this.text = this.backup;
  }

}