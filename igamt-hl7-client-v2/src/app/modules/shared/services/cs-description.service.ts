import { Injectable } from '@angular/core';
import { AssertionMode, IAssertion, IIfThenAssertion, INotAssertion, IOperatorAssertion, ISubContextAssertion } from '../models/cs.interface';

@Injectable({
  providedIn: 'root',
})
export class CsDescriptionService {

  constructor() { }

  updateAssertionDescription(assertion: IAssertion) {
    switch (assertion.mode) {
      case AssertionMode.ANDOR:
        this.updateOperatorDescription(assertion as IOperatorAssertion);
        break;
      case AssertionMode.IFTHEN:
        this.updateIfThenDescription(assertion as IIfThenAssertion);
        break;
      case AssertionMode.NOT:
        this.updateNotDescription(assertion as INotAssertion);
        break;
      case AssertionMode.SUBCONTEXT:
        this.updateSubContextDescription(assertion as ISubContextAssertion);
        break;
      case AssertionMode.SIMPLE:
        assertion.description = assertion.description ? assertion.description : '_';
        break;
    }

  }

  updateOperatorDescription(assertion: IOperatorAssertion) {
    const descriptions = assertion.assertions.map((a) => {
      this.updateAssertionDescription(a);
      return a.description;
    });
    assertion.description = '( ' + descriptions.join(' ' + assertion.operator + ' ') + ' )';
  }

  updateIfThenDescription(assertion: IIfThenAssertion) {
    this.updateAssertionDescription(assertion.ifAssertion);
    this.updateAssertionDescription(assertion.thenAssertion);
    assertion.description = `If ${assertion.ifAssertion.description ? assertion.ifAssertion.description : '_'} then ${assertion.thenAssertion.description ? assertion.thenAssertion.description : '_'}`;
  }

  updateNotDescription(assertion: INotAssertion) {
    this.updateAssertionDescription(assertion.child);
    assertion.description = `NOT ${assertion.child.description}`;
  }

  updateSubContextDescription(assertion: ISubContextAssertion) {
    this.updateAssertionDescription(assertion.child);
    assertion.description = `${assertion.child.description} IN ${assertion.context.description ? assertion.context.description : '_'}`;
  }
}
