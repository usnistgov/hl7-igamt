import { TestBed, inject } from '@angular/core/testing';

import { IgErrorService } from './ig-error.service';

describe('LibErrorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IgErrorService]
    });
  });

  it('should be created', inject([IgErrorService], (service: IgErrorService) => {
    expect(service).toBeTruthy();
  }));
});
