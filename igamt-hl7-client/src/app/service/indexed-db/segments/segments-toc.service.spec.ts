import { TestBed, inject } from '@angular/core/testing';

import {SegmentsTocService} from './segments-toc.service';

describe('SegmentsTocService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SegmentsTocService]
    });
  });

  it('should be created', inject([SegmentsTocService], (service: SegmentsTocService) => {
    expect(service).toBeTruthy();
  }));
});
