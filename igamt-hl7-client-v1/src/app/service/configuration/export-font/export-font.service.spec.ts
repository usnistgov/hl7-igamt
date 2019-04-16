import { TestBed, inject } from '@angular/core/testing';
import {ExportFontService} from './export-font.service';


describe('ExportFontService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExportFontService]
    });
  });

  it('should be created', inject([ExportFontService], (service: ExportFontService) => {
    expect(service).toBeTruthy();
  }));
});
