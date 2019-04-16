import { TestBed, inject } from '@angular/core/testing';

import { LibDeleteElementService } from './lib-delete-element.service';

describe('LibDeleteElementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LibDeleteElementService]
    });
  });

  it('should be created', inject([LibDeleteElementService], (service: LibDeleteElementService) => {
    expect(service).toBeTruthy();
  }));
});
