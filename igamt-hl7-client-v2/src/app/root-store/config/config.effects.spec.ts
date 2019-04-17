import { inject, TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { ConfigEffects } from './config.effects';

describe('ConfigEffects', () => {
  const actions$: Observable<any> = null;
  let effects: ConfigEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfigEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.get(ConfigEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
