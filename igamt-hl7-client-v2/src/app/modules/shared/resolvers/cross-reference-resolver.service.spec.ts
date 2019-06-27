import { TestBed } from '@angular/core/testing';

import { CrossReferenceResolverService } from './cross-reference-resolver.service';

describe('CrossReferenceResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CrossReferenceResolverService = TestBed.get(CrossReferenceResolverService);
    expect(service).toBeTruthy();
  });
});
