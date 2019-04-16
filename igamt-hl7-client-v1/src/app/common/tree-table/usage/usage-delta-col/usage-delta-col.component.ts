import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-usage-delta-col',
  templateUrl: './usage-delta-col.component.html',
  styleUrls: ['./usage-delta-col.component.css']
})
export class UsageDeltaColComponent implements OnInit {

  @Input() usage: any;
  @Input() bindings: any[];

  previousPredicate: any;
  currentPredicate: any;


  constructor() {}

  ngOnInit() {
    if (this.bindings && this.bindings.length > 0) {
      const oldBindings = this.bindings.filter(binding => binding['_.deltaKey'] && binding['_.deltaKey'].source === 'origin');
      const newBindings = this.bindings.filter(binding => binding['_.deltaKey'] && binding['_.deltaKey'].source === 'target');
      this.previousPredicate = this.determinePredicate(oldBindings);
      this.currentPredicate = this.determinePredicate(newBindings);
    }
  }

  determinePredicate(bindings: any[]) {
    let currentPredicatePriority = 100;
    let currentPredicate;

    for (const i in bindings) {
      if (this.bindings[i].predicate) {
        if (this.bindings[i].priority < currentPredicatePriority) {
          currentPredicatePriority = this.bindings[i].priority;
          currentPredicate = this.bindings[i].predicate;
        }
      }
    }

    return currentPredicate;
  }

  deltaOp(): 'UPDATED' | 'UNCHANGED' | 'ADDED' | 'DELETED' {
    if (this.usage['_.operation'] === 'UNCHANGED' && this.usage.current === 'C') {
      return this.predicateOp();
    } else {
      return this.usage['_.operation'];
    }
  }

  predicateOp(): 'UPDATED' | 'UNCHANGED' | 'ADDED' | 'DELETED' {
    if (!this.previousPredicate && this.currentPredicate) {
      return 'ADDED';
    }
    if (this.previousPredicate && !this.currentPredicate) {
      return 'DELETED';
    }
    if (!this.previousPredicate && !this.currentPredicate) {
      return 'UNCHANGED';
    }

    const trueUsage = this.previousPredicate.trueUsage === this.currentPredicate.trueUsage;
    const falseUsage = this.previousPredicate.falseUsage === this.currentPredicate.falseUsage;

    if (trueUsage && falseUsage) {
      return 'UNCHANGED';
    } else {
      return 'UPDATED';
    }
  }
}
