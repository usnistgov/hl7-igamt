import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Observable} from 'rxjs';

import {CreateDocumentEffects} from './create-document.effects';

describe('CreateIgEffects', () => {
  const actions$: Observable<any> = null;
  let effects: CreateDocumentEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CreateDocumentEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.get(CreateDocumentEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
