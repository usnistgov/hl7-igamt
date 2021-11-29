import { TestBed } from '@angular/core/testing';

import { SlicingService } from './slicing.service';

describe('SlicingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SlicingService = TestBed.get(SlicingService);
    expect(service).toBeTruthy();
  });
});
