import { TestBed, inject } from '@angular/core/testing';

import { DatatypeColService } from './datatype-col.service';

describe('DatatypeColService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatatypeColService]
    });
  });

  it('should be created', inject([DatatypeColService], (service: DatatypeColService) => {
    expect(service).toBeTruthy();
  }));
});
