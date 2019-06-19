import { inject, TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { CrossRefsEffects } from './cross-refs.effects';

describe('CrossRefsEffects', () => {
  let actions$: Observable<any>;
  let effects: CrossRefsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CrossRefsEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.get(CrossRefsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
