import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
  selector : 'cardinality-col',
  templateUrl : './cardinality-col.component.html',
  styleUrls : ['./cardinality-col.component.css']
})

export class CardinalityColComponent {
  @Input() min: string;
  @Output() minChange = new EventEmitter<string>();

  @Input() max: string;
  @Output() maxChange = new EventEmitter<string>();

  @Input() idPath : string;

  onMinChange() {
    this.minChange.emit(this.min);
  }

  onMaxChange() {
    this.maxChange.emit(this.max);
  }

  constructor(){}

  ngOnInit(){}
}