import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositeDeltaEditorComponent } from './composite-delta-editor.component';

describe('CompositeDeltaEditorComponent', () => {
  let component: CompositeDeltaEditorComponent;
  let fixture: ComponentFixture<CompositeDeltaEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompositeDeltaEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompositeDeltaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
