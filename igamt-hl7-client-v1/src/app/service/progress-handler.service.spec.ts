import { TestBed, inject } from '@angular/core/testing';

import { ProgressHandlerService } from './progress-handler.service';

describe('ProgressHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProgressHandlerService]
    });
  });

  it('should be created', inject([ProgressHandlerService], (service: ProgressHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
