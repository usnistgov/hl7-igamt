import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Observable} from 'rxjs';

import {CreateLibraryEffects} from './create-library.effects';

describe('CreateIgEffects', () => {
  const actions$: Observable<any> = null;
  let effects: CreateLibraryEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CreateLibraryEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.get(CreateLibraryEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
