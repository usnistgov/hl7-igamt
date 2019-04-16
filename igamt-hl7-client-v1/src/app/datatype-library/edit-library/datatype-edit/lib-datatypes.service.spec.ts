import { TestBed, inject } from '@angular/core/testing';

import { LibDatatypesService } from './lib-datatypes.service';

describe('LibDatatypesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LibDatatypesService]
    });
  });

  it('should be created', inject([LibDatatypesService], (service: LibDatatypesService) => {
    expect(service).toBeTruthy();
  }));
});
