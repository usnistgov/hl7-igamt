import { TestBed, inject } from '@angular/core/testing';

import { UrlParserServiceService } from './url-parser-service.service';

describe('UrlParserServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UrlParserServiceService]
    });
  });

  it('should be created', inject([UrlParserServiceService], (service: UrlParserServiceService) => {
    expect(service).toBeTruthy();
  }));
});
