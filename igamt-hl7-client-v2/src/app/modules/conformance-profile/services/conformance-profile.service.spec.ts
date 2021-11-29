import { TestBed } from '@angular/core/testing';

import { ConformanceProfileService } from './conformance-profile.service';

describe('ConformanceProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConformanceProfileService = TestBed.get(ConformanceProfileService);
    expect(service).toBeTruthy();
  });
});
