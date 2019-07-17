import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueSetPredefEditorComponent } from './value-set-predef-editor.component';

describe('ValueSetPredefEditorComponent', () => {
  let component: ValueSetPredefEditorComponent;
  let fixture: ComponentFixture<ValueSetPredefEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueSetPredefEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueSetPredefEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
