import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
@Component({
  selector: 'app-select-versions',
  templateUrl: './select-versions.component.html',
  styleUrls: ['./select-versions.component.scss'],
})
export class SelectVersionsComponent implements OnInit {

  constructor() { }

  @Input()
  hl7Versions: string[];

  @Output()
  selected = new EventEmitter<string>();

  selectedVersion: string;

  ngOnInit() {
  }

  select($event: any) {
    this.selectedVersion = $event;
    this.selected.emit($event);
  }
}
