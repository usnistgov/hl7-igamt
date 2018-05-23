import { TestBed, inject } from '@angular/core/testing';

import {ProfileComponentsTocService} from './profile-components-toc.service';

describe('ProfileComponentsTocService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileComponentsTocService]
    });
  });

  it('should be created', inject([ProfileComponentsTocService], (service: ProfileComponentsTocService) => {
    expect(service).toBeTruthy();
  }));
});
