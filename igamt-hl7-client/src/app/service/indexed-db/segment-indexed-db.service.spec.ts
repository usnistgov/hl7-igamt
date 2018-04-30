import { TestBed, inject } from '@angular/core/testing';

import {SegmentIndexedDbService} from './segment-indexed-db.service';

describe('SegmentIndexedDbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SegmentIndexedDbService]
    });
  });

  it('should be created', inject([SegmentIndexedDbService], (service: SegmentIndexedDbService) => {
    expect(service).toBeTruthy();
  }));
});
