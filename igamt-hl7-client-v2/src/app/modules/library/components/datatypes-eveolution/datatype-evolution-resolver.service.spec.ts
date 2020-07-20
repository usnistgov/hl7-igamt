import { TestBed } from '@angular/core/testing';

import { DatatypeEvolutionResolverService } from './datatype-evolution-resolver.service';

describe('DatatypeEvolutionResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatatypeEvolutionResolverService = TestBed.get(DatatypeEvolutionResolverService);
    expect(service).toBeTruthy();
  });
});
