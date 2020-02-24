import { TestBed, async, inject } from '@angular/core/testing';

import { CanDeactivateDocumentationGuard } from './can-deactivate-documentation.guard';

describe('CanDeactivateDocumentationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanDeactivateDocumentationGuard]
    });
  });

  it('should ...', inject([CanDeactivateDocumentationGuard], (guard: CanDeactivateDocumentationGuard) => {
    expect(guard).toBeTruthy();
  }));
});
