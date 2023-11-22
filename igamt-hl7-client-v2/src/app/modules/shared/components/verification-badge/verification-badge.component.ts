import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Severity } from '../../models/verification.interface';
import { IVerificationEnty } from './../../../dam-framework/models/data/workspace';

@Component({
  selector: 'app-verification-badge',
  templateUrl: './verification-badge.component.html',
  styleUrls: ['./verification-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationBadgeComponent implements OnInit {

  severity: Severity;

  @Input()
  set verification(entries: IVerificationEnty[]) {
    this.severity = undefined;
    for (const entry of entries) {
      if (entry.severity === Severity.FATAL) {
        this.severity = Severity.FATAL;
        break;
      } else if (entry.severity === Severity.ERROR) {
        this.severity = Severity.ERROR;
        break;
      }
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
