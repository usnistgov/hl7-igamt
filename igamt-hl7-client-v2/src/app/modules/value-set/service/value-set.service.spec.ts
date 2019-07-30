import { TestBed } from '@angular/core/testing';

import { ValueSetService } from './value-set.service';

describe('ValueSetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ValueSetService = TestBed.get(ValueSetService);
    expect(service).toBeTruthy();
  });
});
