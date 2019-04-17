import { inject, TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { CreateIgEffects } from './create-ig.effects';

describe('CreateIgEffects', () => {
  const actions$: Observable<any> = null;
  let effects: CreateIgEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CreateIgEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.get(CreateIgEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
