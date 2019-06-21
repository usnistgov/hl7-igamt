import { TestBed } from '@angular/core/testing';

import { ResourceRepositoryService } from './resource-repository.service';

describe('ResourceRepositoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResourceRepositoryService = TestBed.get(ResourceRepositoryService);
    expect(service).toBeTruthy();
  });
});
