import { TestBed } from '@angular/core/testing';

import { FroalaService } from './froala.service';

describe('FroalaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FroalaService = TestBed.get(FroalaService);
    expect(service).toBeTruthy();
  });
});
