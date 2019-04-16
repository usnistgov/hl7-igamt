import { TestBed, inject } from '@angular/core/testing';

import { LibErrorService } from './lib-error.service';

describe('LibErrorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LibErrorService]
    });
  });

  it('should be created', inject([LibErrorService], (service: LibErrorService) => {
    expect(service).toBeTruthy();
  }));
});
