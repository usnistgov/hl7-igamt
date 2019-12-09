import { TestBed } from '@angular/core/testing';

import { TreeFilterService } from './tree-filter.service';

describe('TreeFilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TreeFilterService = TestBed.get(TreeFilterService);
    expect(service).toBeTruthy();
  });
});
