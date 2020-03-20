import { TestBed } from '@angular/core/testing';

import { DocumentAdapterService } from './document-adapter.service';

describe('DocumentAdapterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumentAdapterService = TestBed.get(DocumentAdapterService);
    expect(service).toBeTruthy();
  });
});
