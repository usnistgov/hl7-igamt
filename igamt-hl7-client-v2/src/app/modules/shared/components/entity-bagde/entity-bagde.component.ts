import {Component, Input, OnInit} from '@angular/core';
import {Type} from '../../constants/type.enum';

@Component({
  selector: 'app-entity-bagde',
  templateUrl: './entity-bagde.component.html',
  styleUrls: ['./entity-bagde.component.scss'],
})
export class EntityBagdeComponent implements OnInit {

  @Input() type: Type;

  constructor() {
  }

  ngOnInit() {
  }

}
