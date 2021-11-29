import { TestBed } from '@angular/core/testing';

import { OpenEditorService } from './open-editor.service';

describe('OpenEditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OpenEditorService = TestBed.get(OpenEditorService);
    expect(service).toBeTruthy();
  });
});
