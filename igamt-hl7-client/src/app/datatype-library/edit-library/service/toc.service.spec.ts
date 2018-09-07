import { TestBed, inject } from '@angular/core/testing';

import { TocService } from './toc.service';

describe('TocService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TocService]
    });
  });

  it('should be created', inject([TocService], (service: TocService) => {
    expect(service).toBeTruthy();
  }));
});
