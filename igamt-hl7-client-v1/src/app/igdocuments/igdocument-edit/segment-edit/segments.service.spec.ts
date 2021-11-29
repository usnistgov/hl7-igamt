import { TestBed, inject } from '@angular/core/testing';

import { SegmentsService } from './segments.service';

describe('SegmentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SegmentsService]
    });
  });

  it('should be created', inject([SegmentsService], (service: SegmentsService) => {
    expect(service).toBeTruthy();
  }));
});
