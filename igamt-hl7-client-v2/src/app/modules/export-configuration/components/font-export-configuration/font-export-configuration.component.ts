import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import {CardModule} from 'primeng/card';
import {TabViewModule} from 'primeng/tabview';
import {MatSliderModule, MatSliderChange, MatSlider} from '@angular/material/slider';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';




@Component({
  selector: 'app-font-export-configuration',
  templateUrl: './font-export-configuration.component.html',
  styleUrls: ['./font-export-configuration.component.css']
})
export class FontExportConfigurationComponent implements OnInit {

  value=0;

  defaultFont: "'Arial Narrow',sans-serif";
  choosenFont: string;
  fonts: string[] = ["'Arial Narrow',sans-serif", "'Palatino Linotype', 'Book Antiqua', Palatino, serif", "'Times New Roman', Times, serif", "Georgia, serif","'Comic Sans MS', cursive, sans-serif","'Lucida Sans Unicode', 'Lucida Grande', sans-serif", "Tahoma, Geneva, sans-serif", "'Trebuchet MS', Helvetica, sans-serif", "Verdana, Geneva, sans-serif","'Courier New', Courier, monospace","'Lucida Console', Monaco, monospace"];

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

  // @Output()
  // detectChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    console.log("Is it ORIGINAL : " + this.viewOnly);
  }

  onInputChange(event: MatSliderChange) {
    this.detectChange.emit(this.config);
  }

  triggerChange() {
    // this.config.exportFont.name = this.choosenFont;
    this.config.exportFont.value = this.config.exportFont.name + ";";
    this.detectChange.emit(this.config);

   }

  // triggerChange() {
  //   console.log("value :" + this.value)
  //   this.detectChange.emit(this.config);
  //   console.log("value :" + this.value)
  // }



  print() {
  }

}
