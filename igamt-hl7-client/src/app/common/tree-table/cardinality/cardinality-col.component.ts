import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector : 'cardinality-col',
  templateUrl : './cardinality-col.component.html',
  styleUrls : ['./cardinality-col.component.css']
})

export class CardinalityColComponent {
  @Input() min: number;
  @Output() minChange = new EventEmitter<number>();

  @Input() max: string;
  @Output() maxChange = new EventEmitter<string>();

  @Input() changeItems: any[];
  @Output() changeItemsChange = new EventEmitter<any[]>();

  @Input() idPath : string;

  onMinChange() {
    let item:any = {};
    item.location = this.idPath;
    item.propertyType = 'CARDINALITYMIN';
    item.propertyValue = this.min;
    item.changeType = "UPDATE";
    this.changeItems.push(item);

    this.minChange.emit(this.min);
    this.changeItemsChange.emit(this.changeItems);
  }

  onMaxChange() {
    let item:any = {};
    item.location = this.idPath;
    item.propertyType = 'CARDINALITYMAX';
    item.propertyValue = this.max;
    item.changeType = "UPDATE";
    this.changeItems.push(item);

    this.maxChange.emit(this.max);
    this.changeItemsChange.emit(this.changeItems);
  }

  constructor(){}

  ngOnInit(){}
}