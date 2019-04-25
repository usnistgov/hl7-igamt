import { TestBed } from '@angular/core/testing';

import { IgTocService } from './ig-toc.service';

describe('IgTocService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IgTocService = TestBed.get(IgTocService);
    expect(service).toBeTruthy();
  });
});
