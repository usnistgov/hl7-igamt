import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositionEditorComponent } from './composition-editor.component';

describe('CompositionEditorComponent', () => {
  let component: CompositionEditorComponent;
  let fixture: ComponentFixture<CompositionEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompositionEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompositionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
