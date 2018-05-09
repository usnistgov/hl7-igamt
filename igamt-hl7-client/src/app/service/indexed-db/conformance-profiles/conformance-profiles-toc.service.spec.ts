import { TestBed, inject } from '@angular/core/testing';

import {ConformanceProfilesTocService} from './conformance-profiles-toc.service';

describe('ConformanceProfilesTocService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConformanceProfilesTocService]
    });
  });

  it('should be created', inject([ConformanceProfilesTocService], (service: ConformanceProfilesTocService) => {
    expect(service).toBeTruthy();
  }));
});
