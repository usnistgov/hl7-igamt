import { TestBed, inject } from '@angular/core/testing';

import {DatatypesIndexedDbService} from './datatypes-indexed-db.service';

describe('DatatypesIndexedDbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatatypesIndexedDbService]
    });
  });

  it('should be created', inject([DatatypesIndexedDbService], (service: DatatypesIndexedDbService) => {
    expect(service).toBeTruthy();
  }));
});
