import { IVerificationEnty } from './../../../dam-framework/models/data/workspace';
import { IVerificationEntryList } from './../../services/verification.service';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Type } from '../../constants/type.enum';
import { IDisplayElement } from '../../models/display-element.interface';

@Component({
  selector: 'app-display-section',
  templateUrl: './display-section.component.html',
  styleUrls: ['./display-section.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplaySectionComponent implements OnInit {

  @Input() element: IDisplayElement;
  @Input() hideDescription: boolean;
  @Input()
  inline: boolean;
  @Input()
  compatibility: boolean;
  @Input()
  hideBadge: boolean;
  @Input()
  ignoreScope: boolean;

  @Input()
  verification: IVerificationEnty;

  constructor(    private router: Router,
                  private activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
  }

  getDisplayLabel() {
    // tslint:disable-next-line: no-small-switch
    switch (this.element.type) {
      case Type.COCONSTRAINTGROUP:
        return this.element.fixedName + ' - ' + this.element.variableName;
      case Type.PROFILECOMPONENT:
        return this.element.variableName;
      case Type.COMPOSITEPROFILE:
        return this.element.variableName;
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
