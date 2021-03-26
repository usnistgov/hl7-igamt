import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { CompositeProfileEffects } from './composite-profile.effects';

describe('CompositeProfileEffects', () => {
  let actions$: Observable<any>;
  let effects: CompositeProfileEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CompositeProfileEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(CompositeProfileEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
