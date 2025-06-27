import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ResourceOrigin} from '../../constants/resource-origin.enum';
import {Scope} from '../../constants/scope.enum';
import { Stability } from './../../constants/stability.enum';
import { SourceType } from './../../models/adding-info';

@Component({
  selector: 'app-scope-badge',
  templateUrl: './scope-badge.component.html',
  styleUrls: ['./scope-badge.component.scss'],
})
export class ScopeBadgeComponent implements OnInit {

  @Input() scope: Scope;
  @Input() version: string;
  @Input() flavor: boolean;
  @Input() resourceOrigin: ResourceOrigin;
  @Input() sourceType: SourceType;
  @Input() stability: Stability;
  @Input() url: string;

  constructor() {
  }

  ngOnInit() {
  }

}
