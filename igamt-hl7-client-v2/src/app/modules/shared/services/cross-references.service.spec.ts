import { TestBed } from '@angular/core/testing';

import { CrossReferencesService } from './cross-references.service';

describe('CrossReferencesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CrossReferencesService = TestBed.get(CrossReferencesService);
    expect(service).toBeTruthy();
  });
});
