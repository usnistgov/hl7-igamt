import { TestBed, inject } from '@angular/core/testing';

import { ProfileComponentsService } from './profilecomponents.service';

describe('ProfileComponentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileComponentsService]
    });
  });

  it('should be created', inject([ProfileComponentsService], (service: ProfileComponentsService) => {
    expect(service).toBeTruthy();
  }));
});
