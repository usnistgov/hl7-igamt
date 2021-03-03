import { TestBed } from '@angular/core/testing';

import { PcTreeService } from './pc-tree.service';

describe('PcTreeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PcTreeService = TestBed.get(PcTreeService);
    expect(service).toBeTruthy();
  });
});
