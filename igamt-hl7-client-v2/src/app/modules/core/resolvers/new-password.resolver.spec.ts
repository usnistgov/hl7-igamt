import { TestBed } from '@angular/core/testing';

import { NewPasswordResolver } from './new-password.resolver';

describe('NewPasswordResolver', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewPasswordResolver = TestBed.get(NewPasswordResolver);
    expect(service).toBeTruthy();
  });
});
