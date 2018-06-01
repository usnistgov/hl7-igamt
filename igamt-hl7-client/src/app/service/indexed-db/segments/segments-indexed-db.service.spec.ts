import { TestBed, inject } from '@angular/core/testing';

import {SegmentsIndexedDbService} from './segments-indexed-db.service';

describe('SegmentsIndexedDbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SegmentsIndexedDbService]
    });
  });

  it('should be created', inject([SegmentsIndexedDbService], (service: SegmentsIndexedDbService) => {
    expect(service).toBeTruthy();
  }));
});
