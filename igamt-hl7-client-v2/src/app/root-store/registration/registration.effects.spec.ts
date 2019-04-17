import { TestBed } from '@angular/core/testing';

import { RegistrationEffects } from './registration.effects';

describe('RegistrationEffects', () => {
  let effects: RegistrationEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RegistrationEffects,
      ],
    });

    effects = TestBed.get(RegistrationEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
