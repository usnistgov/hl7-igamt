import { TestBed, inject } from '@angular/core/testing';

import {CompositeProfilesTocService} from './composite-profiles-toc.service';

describe('CompositeProfilesTocService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompositeProfilesTocService]
    });
  });

  it('should be created', inject([CompositeProfilesTocService], (service: CompositeProfilesTocService) => {
    expect(service).toBeTruthy();
  }));
});
