import { TestBed } from '@angular/core/testing';

import { SegmentService } from './segment.service';

describe('SegmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SegmentService = TestBed.get(SegmentService);
    expect(service).toBeTruthy();
  });
});
