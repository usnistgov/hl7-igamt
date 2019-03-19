import { TestBed, inject } from '@angular/core/testing';

import { CrossReferenceService } from './cross-reference.service';

describe('CrossReferenceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CrossReferenceService]
    });
  });

  it('should be created', inject([CrossReferenceService], (service: CrossReferenceService) => {
    expect(service).toBeTruthy();
  }));
});
