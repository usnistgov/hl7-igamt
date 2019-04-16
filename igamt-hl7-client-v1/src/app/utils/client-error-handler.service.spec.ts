import { TestBed, inject } from '@angular/core/testing';

import { ClientErrorHandlerService } from './client-error-handler.service';

describe('ClientErrorHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientErrorHandlerService]
    });
  });

  it('should be created', inject([ClientErrorHandlerService], (service: ClientErrorHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
