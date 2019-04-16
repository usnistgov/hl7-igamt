import { TestBed, inject } from '@angular/core/testing';
import {TableOptionsService} from './table-options.service';


describe('TableOptionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableOptionsService]
    });
  });

  it('should be created', inject([TableOptionsService], (service: TableOptionsService) => {
    expect(service).toBeTruthy();
  }));
});
