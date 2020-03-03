import { async, inject, TestBed } from '@angular/core/testing';

import { CanActivateDocumentationGuard } from './can-activate-documentation.guard';

describe('CanActivateDocumentationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateDocumentationGuard],
    });
  });

  it('should ...', inject([CanActivateDocumentationGuard], (guard: CanActivateDocumentationGuard) => {
    expect(guard).toBeTruthy();
  }));
});
