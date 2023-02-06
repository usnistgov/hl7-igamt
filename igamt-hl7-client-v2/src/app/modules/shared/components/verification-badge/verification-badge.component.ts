import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { elementStart } from '@angular/core/src/render3';
import * as _ from 'lodash';
import { IVerificationEnty } from './../../../dam-framework/models/data/workspace';

@Component({
  selector: 'app-verification-badge',
  templateUrl: './verification-badge.component.html',
  styleUrls: ['./verification-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationBadgeComponent implements OnInit {

  serverity: string;
  number: number;
  style: string;
  color: string;

  elments: IVerificationEnty[];

  @Input()
  set verification(elments: IVerificationEnty[] ) {
    this.elments = elments;
    if (elments) {
      const group = _.groupBy(elments, 'severity');
      if (group['FATAL']) {
      this.color = 'red';
      this.style = 'fa fa fa-exclamation';
      } else if (group['ERROR']) {
        this.style = 'fa fa fa-exclamation-circle';
        this.color = 'red';
      } else if (group['WARNING']) {
        this.style = 'fa fa-exclamation-triangle';
        this.color = '#bb990c';
      }
    }

  }

  constructor() { }

  ngOnInit() {
  }

  print() {
    console.log(this.elments);
  }

}
