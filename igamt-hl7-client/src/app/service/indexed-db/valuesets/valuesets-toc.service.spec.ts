import { TestBed, inject } from '@angular/core/testing';

import {ValuesetsTocService} from './valuesets-toc.service';

describe('ValuesetsTocService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValuesetsTocService]
    });
  });

  it('should be created', inject([ValuesetsTocService], (service: ValuesetsTocService) => {
    expect(service).toBeTruthy();
  }));
});
