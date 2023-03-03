import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { UserConfigEffects } from './user-config.effects';

describe('UserConfigEffects', () => {
  let actions$: Observable<any>;
  let effects: UserConfigEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserConfigEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(UserConfigEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
