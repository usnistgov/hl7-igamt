import { TestBed } from '@angular/core/testing';

import { WorkspaceListService } from './workspace-list.service';

describe('WorkspaceListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkspaceListService = TestBed.get(WorkspaceListService);
    expect(service).toBeTruthy();
  });
});
