import { TestBed, inject } from '@angular/core/testing';

import { ValueSetsService } from './valueSets.service';

describe('ValueSetsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValueSetsService]
    });
  });

  it('should be created', inject([ValueSetsService], (service: ValueSetsService) => {
    expect(service).toBeTruthy();
  }));
});
