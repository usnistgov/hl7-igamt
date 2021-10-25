import { Component, OnInit, Input } from '@angular/core';
import { Severity } from '../../models/verification.interface';

@Component({
  selector: 'app-issue-badge',
  templateUrl: './issue-badge.component.html',
  styleUrls: ['./issue-badge.component.scss'],
})
export class IssueBadgeComponent implements OnInit {
  SEVERITY = Severity;
  @Input()
  type: Severity;
  @Input()
  number: number;
  @Input()
  label: boolean;

  constructor() { }

  ngOnInit() {
  }

}
