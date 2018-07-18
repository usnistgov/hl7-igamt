import { TestBed, inject } from '@angular/core/testing';
import {IgDocumentService} from './ig-document.service';


describe('IgDocumentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IgDocumentService]
    });
  });

  it('should be created', inject([IgDocumentService], (service: IgDocumentService) => {
    expect(service).toBeTruthy();
  }));
});
