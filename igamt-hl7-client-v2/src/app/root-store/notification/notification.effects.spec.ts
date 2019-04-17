import { inject, TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { NotificationEffects } from './notification.effects';

describe('NotificationEffects', () => {
  let effects: NotificationEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationEffects,
      ],
    });

    effects = TestBed.get(NotificationEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
