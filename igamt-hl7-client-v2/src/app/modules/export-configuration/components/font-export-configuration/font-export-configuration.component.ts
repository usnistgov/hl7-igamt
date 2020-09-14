import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {MatSlider, MatSliderChange, MatSliderModule} from '@angular/material/slider';

@Component({
  selector: 'app-font-export-configuration',
  templateUrl: './font-export-configuration.component.html',
  styleUrls: ['./font-export-configuration.component.css'],
})
export class FontExportConfigurationComponent implements OnInit {
  constructor() { }

  value = 0;
  defaultFont: '\'Arial Narrow\',sans-serif';
  choosenFont: string;
  fonts: string[] = ['\'Arial Narrow\',sans-serif', '\'Palatino Linotype\', \'Book Antiqua\', Palatino, serif', '\'Times New Roman\', Times, serif', 'Georgia, serif', '\'Comic Sans MS\', cursive, sans-serif', '\'Lucida Sans Unicode\', \'Lucida Grande\', sans-serif', 'Tahoma, Geneva, sans-serif', '\'Trebuchet MS\', Helvetica, sans-serif', 'Verdana, Geneva, sans-serif',
    '\'Courier New\', Courier, monospace', '\'Lucida Console\', Monaco, monospace'];
  @Input()
  config: any;

  @Input()
  displayColumns: boolean;

  @Input()
  viewOnly: boolean;

  @Input()
  derived: boolean;

  @Input()
  origin = null;

  @Input()
  delta: boolean;

  @Output()
  detectChange: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  change: EventEmitter<MatSliderChange>;
  formatLabel: any;

  ngOnInit() {
    console.log('Is it ORIGINAL : ' + this.viewOnly);
  }

  onInputChange(event: MatSliderChange) {
    this.detectChange.emit(this.config);
  }

  triggerChange() {
    this.config.exportFont.value = this.config.exportFont.name + ';';
    this.detectChange.emit(this.config);

   }

  print() {
  }

}
