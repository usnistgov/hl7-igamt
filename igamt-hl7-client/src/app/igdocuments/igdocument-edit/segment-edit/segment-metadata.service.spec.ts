import { TestBed, inject } from '@angular/core/testing';

import { SegmentMetadataService } from './segment-metadata.service';

describe('SegmentMetadataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SegmentMetadataService]
    });
  });

  it('should be created', inject([SegmentMetadataService], (service: SegmentMetadataService) => {
    expect(service).toBeTruthy();
  }));
});
