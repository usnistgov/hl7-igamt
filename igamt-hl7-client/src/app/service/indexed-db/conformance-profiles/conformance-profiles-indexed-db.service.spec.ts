import { TestBed, inject } from '@angular/core/testing';

import {ConformanceProfilesIndexedDbService} from './conformance-profiles-indexed-db.service';

describe('ConformanceProfilesIndexedDbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConformanceProfilesIndexedDbService]
    });
  });

  it('should be created', inject([ConformanceProfilesIndexedDbService], (service: ConformanceProfilesIndexedDbService) => {
    expect(service).toBeTruthy();
  }));
});
