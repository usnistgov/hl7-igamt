import { TestBed } from '@angular/core/testing';

import { CoConstraintEntityService } from './co-constraint-entity.service';

describe('CoConstraintEntityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoConstraintEntityService = TestBed.get(CoConstraintEntityService);
    expect(service).toBeTruthy();
  });
});
