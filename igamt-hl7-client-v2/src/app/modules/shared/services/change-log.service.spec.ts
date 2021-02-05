import { TestBed } from '@angular/core/testing';

import { ChangeLogService } from './change-log.service';

describe('ChangeLogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChangeLogService = TestBed.get(ChangeLogService);
    expect(service).toBeTruthy();
  });
});
