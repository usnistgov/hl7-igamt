import { TestBed, inject } from '@angular/core/testing';

import { DeltaService } from './delta.service';

describe('DeltaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeltaService]
    });
  });

  it('should be created', inject([DeltaService], (service: DeltaService) => {
    expect(service).toBeTruthy();
  }));
});
