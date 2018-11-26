import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternEditorDemoComponent } from './pattern-editor-demo.component';

describe('PatternEditorDemoComponent', () => {
  let component: PatternEditorDemoComponent;
  let fixture: ComponentFixture<PatternEditorDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatternEditorDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatternEditorDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
