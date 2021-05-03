import { TestBed } from '@angular/core/testing';

import { CompositeProfileService } from './composite-profile.service';

describe('CompositeProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompositeProfileService = TestBed.get(CompositeProfileService);
    expect(service).toBeTruthy();
  });
});
