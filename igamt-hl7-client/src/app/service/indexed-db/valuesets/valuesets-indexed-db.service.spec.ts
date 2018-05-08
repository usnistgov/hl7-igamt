import { TestBed, inject } from '@angular/core/testing';

import {ValuesetsIndexedDbService} from './valuesets-indexed-db.service';

describe('ValuesetIndexedDbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValuesetsIndexedDbService]
    });
  });

  it('should be created', inject([ValuesetsIndexedDbService], (service: ValuesetsIndexedDbService) => {
    expect(service).toBeTruthy();
  }));
});
