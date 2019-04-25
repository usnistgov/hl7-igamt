import { TestBed } from '@angular/core/testing';

import { NodeHelperService } from './node-helper.service';

describe('NodeHelperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NodeHelperService = TestBed.get(NodeHelperService);
    expect(service).toBeTruthy();
  });
});
