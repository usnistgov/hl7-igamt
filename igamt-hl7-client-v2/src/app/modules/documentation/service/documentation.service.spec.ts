import { TestBed } from '@angular/core/testing';

import { DocumentationService } from './documentation.service';

describe('DocumentationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumentationService = TestBed.get(DocumentationService);
    expect(service).toBeTruthy();
  });
});
