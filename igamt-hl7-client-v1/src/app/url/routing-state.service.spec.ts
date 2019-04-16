import { TestBed, inject } from '@angular/core/testing';

import { RoutingStateService } from './routing-state.service';

describe('RoutingStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoutingStateService]
    });
  });

  it('should be created', inject([RoutingStateService], (service: RoutingStateService) => {
    expect(service).toBeTruthy();
  }));
});
