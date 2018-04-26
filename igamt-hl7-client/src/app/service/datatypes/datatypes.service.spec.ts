import { TestBed, inject } from '@angular/core/testing';

import { DatatypesService } from './datatypes.service';

describe('DatatypesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatatypesService]
    });
  });

  it('should be created', inject([DatatypesService], (service: DatatypesService) => {
    expect(service).toBeTruthy();
  }));
});
