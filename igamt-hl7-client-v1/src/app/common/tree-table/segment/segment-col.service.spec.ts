import { TestBed, inject } from '@angular/core/testing';

import { SegmentColService } from './segment-col.service';

describe('SegmentColService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SegmentColService]
    });
  });

  it('should be created', inject([SegmentColService], (service: SegmentColService) => {
    expect(service).toBeTruthy();
  }));
});
