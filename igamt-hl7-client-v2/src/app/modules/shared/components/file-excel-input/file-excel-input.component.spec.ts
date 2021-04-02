import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExcelInputComponent } from './file-excel-input.component';

describe('FileExcelInputComponent', () => {
  let component: FileExcelInputComponent;
  let fixture: ComponentFixture<FileExcelInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileExcelInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileExcelInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
