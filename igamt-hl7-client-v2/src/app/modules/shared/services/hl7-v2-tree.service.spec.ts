import { TestBed } from '@angular/core/testing';

import { Hl7V2TreeService } from './hl7-v2-tree.service';

describe('Hl7V2TreeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Hl7V2TreeService = TestBed.get(Hl7V2TreeService);
    expect(service).toBeTruthy();
  });
});
