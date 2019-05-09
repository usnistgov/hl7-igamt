import {TestBed} from '@angular/core/testing';

import {NotificationEffects} from './notification.effects';

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
