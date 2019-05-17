import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Scope} from '../../constants/scope.enum';

@Component({
  selector: 'app-scope-badge',
  templateUrl: './scope-badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./scope-badge.component.scss'],
})
export class ScopeBadgeComponent implements OnInit {

  @Input() scope: Scope;
  @Input() version: string;

  constructor() {
  }

  ngOnInit() {
  }

}