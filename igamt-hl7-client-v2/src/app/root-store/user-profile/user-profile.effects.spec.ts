import {TestBed} from '@angular/core/testing';

import {UserProfileEffects} from './user-profile.effects';

describe('UserProfileEffects', () => {
  let effects: UserProfileEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserProfileEffects,
      ],
    });

    effects = TestBed.get(UserProfileEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
