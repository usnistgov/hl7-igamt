import { async, inject, TestBed } from '@angular/core/testing';

import { DocumentTypeGuard } from './document-type.guard';

describe('DocumentTypeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocumentTypeGuard],
    });
  });

  it('should ...', inject([DocumentTypeGuard], (guard: DocumentTypeGuard) => {
    expect(guard).toBeTruthy();
  }));
});
