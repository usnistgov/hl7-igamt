import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSelectInputComponent } from './file-select-input.component';

describe('FileSelectInputComponent', () => {
  let component: FileSelectInputComponent;
  let fixture: ComponentFixture<FileSelectInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileSelectInputComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSelectInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
