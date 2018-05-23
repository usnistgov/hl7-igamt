import { TestBed, inject } from '@angular/core/testing';
import {TocDbService} from './toc-db.service';

describe('TocDbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TocDbService]
    });
  });

  it('should be created', inject([TocDbService], (service: TocDbService) => {
    expect(service).toBeTruthy();
  }));
});
