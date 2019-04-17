import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-scope-badge',
  templateUrl: './scope-badge.component.html',
  styleUrls: ['./scope-badge.component.scss'],
})
export class ScopeBadgeComponent implements OnInit {

  @Input() scope: EntityScope;
  @Input() version: string;

  constructor() { }

  ngOnInit() {
  }

}

export type EntityScope =
  'USER' |
  'HL7' |
  'PRELOADED';
