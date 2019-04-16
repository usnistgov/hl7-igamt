import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportErrorComponent } from './report-error.component';

describe('ReportErrorComponent', () => {
  let component: ReportErrorComponent;
  let fixture: ComponentFixture<ReportErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
