import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatypeStructureEditorComponent } from './datatype-structure-editor.component';

describe('DatatypeStructureEditorComponent', () => {
  let component: DatatypeStructureEditorComponent;
  let fixture: ComponentFixture<DatatypeStructureEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatatypeStructureEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatypeStructureEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
