import { TestBed } from '@angular/core/testing';

import { BindingService } from './binding.service';

describe('BindingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BindingService = TestBed.get(BindingService);
    expect(service).toBeTruthy();
  });
});
