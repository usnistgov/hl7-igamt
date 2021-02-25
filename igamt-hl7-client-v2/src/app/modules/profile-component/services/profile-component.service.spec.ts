import { TestBed } from '@angular/core/testing';

import { ProfileComponentService } from './profile-component.service';

describe('ProfileComponentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfileComponentService = TestBed.get(ProfileComponentService);
    expect(service).toBeTruthy();
  });
});
