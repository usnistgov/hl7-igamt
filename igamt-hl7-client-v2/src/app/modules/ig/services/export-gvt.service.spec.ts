import { TestBed } from '@angular/core/testing';

import { ExportGvtService } from './export-gvt.service';

describe('ExportGvtService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExportGvtService = TestBed.get(ExportGvtService);
    expect(service).toBeTruthy();
  });
});
