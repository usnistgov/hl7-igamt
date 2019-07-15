import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueSetStructureEditorComponent } from './value-set-structure-editor.component';

describe('ValueSetStructureEditorComponent', () => {
  let component: ValueSetStructureEditorComponent;
  let fixture: ComponentFixture<ValueSetStructureEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueSetStructureEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueSetStructureEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
