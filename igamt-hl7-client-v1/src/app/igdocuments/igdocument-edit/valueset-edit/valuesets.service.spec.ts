import { TestBed, inject } from '@angular/core/testing';

import { ValuesetsService } from './valuesets.service';

describe('ValuesetsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValuesetsService]
    });
  });

  it('should be created', inject([ValuesetsService], (service: ValuesetsService) => {
    expect(service).toBeTruthy();
  }));
});