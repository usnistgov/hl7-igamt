import { TestBed } from '@angular/core/testing';

import { IgEditEffects } from './ig-edit.effects';

describe('IgEditEffects', () => {
  let effects: IgEditEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IgEditEffects,
      ],
    });

    effects = TestBed.get(IgEditEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
