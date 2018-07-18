import { TestBed, inject } from '@angular/core/testing';

import { ConformanceProfilesService } from './conformance-profiles.service';

describe('ConformanceProfilesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConformanceProfilesService]
    });
  });

  it('should be created', inject([ConformanceProfilesService], (service: ConformanceProfilesService) => {
    expect(service).toBeTruthy();
  }));
});
