import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Scope} from '../../constants/scope.enum';
import { SourceType } from '../../models/adding-info';

@Component({
  selector: 'app-scope-badge',
  templateUrl: './scope-badge.component.html',
  styleUrls: ['./scope-badge.component.scss'],
})
export class ScopeBadgeComponent implements OnInit {

  @Input() scope: Scope;
  @Input() version: string;
  @Input() flavor: boolean;

  constructor() {
  }

  ngOnInit() {
  }

}
