import { TestBed } from '@angular/core/testing';

import { ConformanceStatementService } from './conformance-statement.service';

describe('ConformanceStatementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConformanceStatementService = TestBed.get(ConformanceStatementService);
    expect(service).toBeTruthy();
  });
});
