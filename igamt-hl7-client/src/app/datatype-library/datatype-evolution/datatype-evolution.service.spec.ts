import { TestBed, inject } from '@angular/core/testing';

import { DatatypeEvolutionService } from './datatype-evolution.service';

describe('DatatypeEvolutionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatatypeEvolutionService]
    });
  });

  it('should be created', inject([DatatypeEvolutionService], (service: DatatypeEvolutionService) => {
    expect(service).toBeTruthy();
  }));
});
