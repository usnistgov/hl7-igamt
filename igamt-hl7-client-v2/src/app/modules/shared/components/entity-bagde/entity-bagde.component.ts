import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-entity-bagde',
  templateUrl: './entity-bagde.component.html',
  styleUrls: ['./entity-bagde.component.scss'],
})
export class EntityBagdeComponent implements OnInit {

  @Input() type: EntityType;

  constructor() { }

  ngOnInit() {
  }

}

export type EntityType =
  'CONFORMANCEPROFILE' |
  'GROUP' |
  'SEGMENT' |
  'FIELD' |
  'COMPONENT' |
  'SUBCOMPONENT' |
  'DOCUMENT' |
  'DATATYPE' |
  'VALUESET';
