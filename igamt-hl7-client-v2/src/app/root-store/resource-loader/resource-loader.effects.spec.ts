import { inject, TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { ResourceLoaderEffects } from './resource-loader.effects';

describe('ResourceLoaderEffects', () => {
  let actions$: Observable<any>;
  let effects: ResourceLoaderEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ResourceLoaderEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.get(ResourceLoaderEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
