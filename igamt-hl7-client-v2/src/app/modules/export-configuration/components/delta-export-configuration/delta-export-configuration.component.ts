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
  public defaultColors = [
    [
      '#ff1744',
      '#d500f9',
      '#3d5afe',
      '#00b0ff',
      '#00e5ff',
      '#1de9b6',
      '#00e676',
      '#76ff03',
      '#ffea00',
      '#ff9100',
      '#4e342e',
      '#37474f'
    ],
    [
      '#ff8a80',
      '#ea80fc',
      '#8c9eff',
      '#80d8ff',
      '#84ffff',
      '#a7ffeb',
      '#b9f6ca',
      '#ccff90',
      '#ffff8d',
      '#ffd180',
      '#6d4c41',
      '#546e7a'
    ],
    [
      '#e57373',
      '#ba68c8',
      '#7986cb',
      '#4fc3f7',
      '#4dd0e1',
      '#4db6ac',
      '#81c784',
      '#aed581',
      '#fff176',
      '#ffb74d',
      '#a1887f',
      '#90a4ae'
    ]

  ];

  @Input()
  active: any;
  @Input()
  config: any;
  @Output()
  updateDelta: EventEmitter<any> = new EventEmitter<any>();

  colorOpened = false;
  openedFor;
  constructor() { }

  ngOnInit() {
  }
  triggerChange(ev) {
    console.log(ev);
    this.updateDelta.emit({ active: this.active, config: this.config });
  }
  toggleColors(target) {
    console.log(target)
    if (target !== this.openedFor) {
      this.openedFor = target;
      this.colorOpened = true;
    } else {
      this.openedFor = null;
      this.colorOpened = false;
    }
  }
  selectColor(target, color) {
    this.openedFor = null;
    this.colorOpened = false;
    switch (target) {
      case 'UPDATED':
        this.config.colors.UPDATED = color;
        break;
      case 'ADDED':
        this.config.colors.ADDED = color;
        break;
      case 'DELETED':
        this.config.colors.DELETED = color;
        break;
    }
  }

}
