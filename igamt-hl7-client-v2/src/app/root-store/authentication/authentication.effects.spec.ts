import {TestBed} from '@angular/core/testing';

import {AuthenticationEffects} from './authentication.effects';

describe('AuthenticationEffects', () => {
  let effects: AuthenticationEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationEffects,
      ],
    });

    effects = TestBed.get(AuthenticationEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
