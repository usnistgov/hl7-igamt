import { TestBed } from '@angular/core/testing';

import { PredicateService } from './predicate.service';

describe('PredicateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PredicateService = TestBed.get(PredicateService);
    expect(service).toBeTruthy();
  });
});
