import {Component, Input, OnInit} from '@angular/core';
import {IDisplayElement} from '../../models/display-element.interface';

@Component({
  selector: 'app-display-section',
  templateUrl: './display-section.component.html',
  styleUrls: ['./display-section.component.css'],
})
export class DisplaySectionComponent implements OnInit {

  @Input() element: IDisplayElement;
  @Input() hideDescription: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  getDisplayLabel() {
    return getLabel(this.element.fixedName, this.element.variableName);
  }

}

export function getLabel(fixedName, variableName) {
  if (fixedName && fixedName.length) {
    if (variableName && variableName.length) {
      return fixedName + '_' + variableName;
    } else {
      return fixedName;
    }
  } else {
    if (variableName) {
      return variableName;
    }
  }
}
