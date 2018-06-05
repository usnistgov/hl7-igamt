import { TestBed, inject } from '@angular/core/testing';

import { NamesAndPositionsService } from './names-and-positions.service';

describe('NamesAndPositionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NamesAndPositionsService]
    });
  });

  it('should be created', inject([NamesAndPositionsService], (service: NamesAndPositionsService) => {
    expect(service).toBeTruthy();
  }));
});
