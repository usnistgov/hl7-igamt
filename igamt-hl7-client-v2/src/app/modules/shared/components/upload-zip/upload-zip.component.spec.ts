import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadZipComponent } from './upload-zip.component';

describe('UploadZipComponent', () => {
  let component: UploadZipComponent;
  let fixture: ComponentFixture<UploadZipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadZipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadZipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
