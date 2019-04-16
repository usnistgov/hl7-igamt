import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector : 'conflength-col',
  templateUrl : './conflength-col.component.html',
  styleUrls : ['./conflength-col.component.css']
})

export class ConfLengthColComponent {
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

  onConfLengthChange() {
    let confChangeItem:any = {};
    confChangeItem.location = this.idPath;
    confChangeItem.propertyType = 'CONFLENGTH';
    confChangeItem.propertyValue = this.confLength;
    confChangeItem.changeType = "UPDATE";
    this.changeItems.push(confChangeItem);

    this.confLengthChange.emit(this.confLength);
    this.changeItemsChange.emit(this.changeItems);
  }

  delConfLength() {
    this.minLength = '0';
    this.maxLength = '*';
    this.confLength = 'NA';

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