import { TestBed, inject } from '@angular/core/testing';

import { DeleteElementService } from './delete-element.service';

describe('DeleteElementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeleteElementService]
    });
  });

  it('should be created', inject([DeleteElementService], (service: DeleteElementService) => {
    expect(service).toBeTruthy();
  }));
});
