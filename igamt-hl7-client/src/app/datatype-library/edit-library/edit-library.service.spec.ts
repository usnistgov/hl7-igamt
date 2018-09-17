import { TestBed, inject } from '@angular/core/testing';

import { EditLibraryService } from './edit-library.service';

describe('EditLibraryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditLibraryService]
    });
  });

  it('should be created', inject([EditLibraryService], (service: EditLibraryService) => {
    expect(service).toBeTruthy();
  }));
});
