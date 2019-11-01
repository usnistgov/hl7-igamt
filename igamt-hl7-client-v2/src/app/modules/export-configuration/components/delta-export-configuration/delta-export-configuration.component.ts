import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-delta-export-configuration',
  templateUrl: './delta-export-configuration.component.html',
  styleUrls: ['./delta-export-configuration.component.scss'],
})
export class DeltaExportConfigurationComponent implements OnInit {

  modeOptions = [
    {
      label: 'Highlight',
      value: 'HIGHLIGHT',
    },
    {
      label: 'Hide',
      value: 'HIDE',
    },
  ];

  @Input()
  active: any;
  @Input()
  config: any;
  @Output()
  updateDelta: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  triggerChange() {
    this.updateDelta.emit({ active: this.active, config: this.config });
  }

}
