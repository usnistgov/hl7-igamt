import { TestBed, inject } from '@angular/core/testing';

import {DatatypesTocService} from './datatypes-toc.service';

describe('DatatypesTocService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatatypesTocService]
    });
  });

  it('should be created', inject([DatatypesTocService], (service: DatatypesTocService) => {
    expect(service).toBeTruthy();
  }));
});
