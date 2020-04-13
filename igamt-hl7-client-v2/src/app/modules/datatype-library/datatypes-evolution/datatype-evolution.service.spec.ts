import { TestBed } from '@angular/core/testing';

import { DatatypeEvolutionService } from './datatype-evolution.service';

describe('DatatypeEvolutionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatatypeEvolutionService = TestBed.get(DatatypeEvolutionService);
    expect(service).toBeTruthy();
  });
});
