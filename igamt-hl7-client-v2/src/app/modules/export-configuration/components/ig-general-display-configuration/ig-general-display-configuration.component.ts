import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ig-general-display-configuration',
  templateUrl: './ig-general-display-configuration.component.html',
  styleUrls: ['./ig-general-display-configuration.component.css'],
})
export class IgGeneralDisplayConfigurationComponent implements OnInit {

  @Input()
  config: any;

  @Input()
  viewOnly: boolean;

  @Input()
  derived: boolean;

  @Input()
  origin = null;

  @Output()
  detectChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  triggerChange() {
    this.detectChange.emit(this.config);
  }
  applyChange(event: any) {
    this.config.deltaMode = event.active;
    this.config.deltaConfig = event.config;
    this.triggerChange();
  }
}
