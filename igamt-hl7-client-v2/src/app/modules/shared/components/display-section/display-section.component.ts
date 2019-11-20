import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IDisplayElement } from '../../models/display-element.interface';
import { Type } from '../../constants/type.enum';

@Component({
  selector: 'app-display-section',
  templateUrl: './display-section.component.html',
  styleUrls: ['./display-section.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplaySectionComponent implements OnInit {

  @Input() element: IDisplayElement;
  @Input() hideDescription: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  getDisplayLabel() {
    switch (this.element.type) {
      case Type.COCONSTRAINTGROUP:
        return this.element.fixedName + ' - ' + this.element.variableName;
      default:
        return getLabel(this.element.fixedName, this.element.variableName);
    }
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
