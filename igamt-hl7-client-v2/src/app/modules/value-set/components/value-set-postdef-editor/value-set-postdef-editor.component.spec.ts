import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueSetPostdefEditorComponent } from './value-set-postdef-editor.component';

describe('ValueSetPostdefEditorComponent', () => {
  let component: ValueSetPostdefEditorComponent;
  let fixture: ComponentFixture<ValueSetPostdefEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueSetPostdefEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueSetPostdefEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
