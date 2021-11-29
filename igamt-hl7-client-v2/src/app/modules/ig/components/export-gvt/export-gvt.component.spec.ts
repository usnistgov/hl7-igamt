import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportGvtComponent } from './export-gvt.component';

describe('ExportGvtComponent', () => {
  let component: ExportGvtComponent;
  let fixture: ComponentFixture<ExportGvtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportGvtComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportGvtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
