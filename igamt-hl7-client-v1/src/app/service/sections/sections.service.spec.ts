import { TestBed, inject } from '@angular/core/testing';

import { SectionsService } from './sections.service';

describe('SectionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SectionsService]
    });
  });

  it('should be created', inject([SectionsService], (service: SectionsService) => {
    expect(service).toBeTruthy();
  }));
});
