import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IPredicate } from '../../../../models/predicate.interface';
import { PropertyType } from '../../../../models/save-change';
import { PredicateService } from '../../../../services/predicate.service';
import { HL7v2TreeColumnComponent } from '../hl7-v2-tree-column.component';

@Component({
  selector: 'app-predicate',
  templateUrl: './predicate.component.html',
  styleUrls: ['./predicate.component.scss'],
})
export class PredicateComponent extends HL7v2TreeColumnComponent<IPredicate> implements OnInit {

  predicate: IPredicate;

  constructor(private predicateService: PredicateService) {
    super([PropertyType.PREDICATE]);
    this.value$.subscribe(
      (v) => {
        this.predicate = v;
      },
    );
  }

  ngOnInit() {
  }

}
