import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector : 'length-col',
  templateUrl : './length-col.component.html',
  styleUrls : ['./length-col.component.css']
})

export class LengthColComponent {
  @Input() minLength: string;
  @Output() minLengthChange = new EventEmitter<string>();

  @Input() maxLength: string;
  @Output() maxLengthChange = new EventEmitter<string>();

  @Input() idPath : string;

  @Input() leaf: boolean;

  @Input() confLength: string;
  @Output() confLengthChange = new EventEmitter<string>();

  @Input() changeItems: any[];
  @Output() changeItemsChange = new EventEmitter<any[]>();

  onMinLengthChange() {
    let item:any = {};
    item.location = this.idPath;
    item.propertyType = 'LENGTHMIN';
    item.propertyValue = this.minLength;
    item.changeType = "UPDATE";
    this.changeItems.push(item);

    this.minLengthChange.emit(this.minLength);
    this.changeItemsChange.emit(this.changeItems);
  }

  onMaxLengthChange() {
    let item:any = {};
    item.location = this.idPath;
    item.propertyType = 'LENGTHMAX';
    item.propertyValue = this.maxLength;
    item.changeType = "UPDATE";
    this.changeItems.push(item);

    this.maxLengthChange.emit(this.maxLength);
    this.changeItemsChange.emit(this.changeItems);
  }

  delLength() {
    this.minLength = 'NA';
    this.maxLength = 'NA';
    this.confLength = '*';

    let minChangeItem:any = {};
    minChangeItem.location = this.idPath;
    minChangeItem.propertyType = 'LENGTHMIN';
    minChangeItem.propertyValue = this.minLength;
    minChangeItem.changeType = "UPDATE";
    this.changeItems.push(minChangeItem);

    let maxChangeItem:any = {};
    maxChangeItem.location = this.idPath;
    maxChangeItem.propertyType = 'LENGTHMAX';
    maxChangeItem.propertyValue = this.maxLength;
    maxChangeItem.changeType = "UPDATE";
    this.changeItems.push(maxChangeItem);

    let confChangeItem:any = {};
    confChangeItem.location = this.idPath;
    confChangeItem.propertyType = 'CONFLENGTH';
    confChangeItem.propertyValue = this.confLength;
    confChangeItem.changeType = "UPDATE";
    this.changeItems.push(confChangeItem);

    this.minLengthChange.emit(this.minLength);
    this.maxLengthChange.emit(this.maxLength);
    this.confLengthChange.emit(this.confLength);
    this.changeItemsChange.emit(this.changeItems);
  }

  constructor(){}

  ngOnInit(){}
}