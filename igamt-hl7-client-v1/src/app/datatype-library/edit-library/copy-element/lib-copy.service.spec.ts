import { TestBed, inject } from '@angular/core/testing';

import { LibCopyService } from './lib-copy.service';

describe('LibCopyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LibCopyService]
    });
  });

  it('should be created', inject([LibCopyService], (service: LibCopyService) => {
    expect(service).toBeTruthy();
  }));
});
