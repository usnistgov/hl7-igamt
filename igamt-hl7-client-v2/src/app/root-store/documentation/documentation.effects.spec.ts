import { inject, TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { DocumentationEffects } from './documentation.effects';

describe('DocumentationEffects', () => {
  const actions$: Observable<any> = null;
  let effects: DocumentationEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DocumentationEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.get(DocumentationEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
