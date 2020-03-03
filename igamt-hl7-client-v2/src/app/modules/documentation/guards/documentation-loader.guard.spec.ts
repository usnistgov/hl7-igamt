import { async, inject, TestBed } from '@angular/core/testing';

import { DocumentationLoaderGuard } from './documentation-loader.guard';

describe('DocumentationLoaderGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocumentationLoaderGuard],
    });
  });

  it('should ...', inject([DocumentationLoaderGuard], (guard: DocumentationLoaderGuard) => {
    expect(guard).toBeTruthy();
  }));
});
