import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConformanceStatementsSummaryEditorComponent } from './conformance-statements-summary-editor.component';

describe('ConformanceStatementsSummaryEditorComponent', () => {
  let component: ConformanceStatementsSummaryEditorComponent;
  let fixture: ComponentFixture<ConformanceStatementsSummaryEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConformanceStatementsSummaryEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConformanceStatementsSummaryEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
