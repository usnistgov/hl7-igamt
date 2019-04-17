import { TestBed } from '@angular/core/testing';

import { IgService } from './ig.service';

describe('IgService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IgService = TestBed.get(IgService);
    expect(service).toBeTruthy();
  });
});
