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

  onConfLengthChange() {
    this.confLengthChange.emit(this.confLength);
  }

  delConfLength() {
    this.minLength = '0';
    this.maxLength = '*';
    this.confLength = 'NA';

    this.minLengthChange.emit(this.minLength);
    this.maxLengthChange.emit(this.maxLength);
    this.confLengthChange.emit(this.confLength);
  }

  constructor(){}

  ngOnInit(){}
}