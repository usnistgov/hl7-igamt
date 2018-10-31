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

  onMinLengthChange() {
    this.minLengthChange.emit(this.minLength);
  }

  onMaxLengthChange() {
    this.maxLengthChange.emit(this.maxLength);
  }

  delLength() {
    this.minLength = 'NA';
    this.maxLength = 'NA';
    this.confLength = '*';

    this.minLengthChange.emit(this.minLength);
    this.maxLengthChange.emit(this.maxLength);
    this.confLengthChange.emit(this.confLength);
  }

  constructor(){}

  ngOnInit(){}
}