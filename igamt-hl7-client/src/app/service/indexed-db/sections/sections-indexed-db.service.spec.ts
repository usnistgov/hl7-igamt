import { TestBed, inject } from '@angular/core/testing';

import {SectionsIndexedDbService} from './sections-indexed-db.service';

describe('SectionsIndexedDbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SectionsIndexedDbService]
    });
  });

  it('should be created', inject([SectionsIndexedDbService], (service: SectionsIndexedDbService) => {
    expect(service).toBeTruthy();
  }));
});
