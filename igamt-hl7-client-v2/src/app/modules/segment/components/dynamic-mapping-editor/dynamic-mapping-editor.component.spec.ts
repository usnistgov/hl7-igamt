import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicMappingEditorComponent } from './dynamic-mapping-editor.component';

describe('DynamicMappingEditorComponent', () => {
  let component: DynamicMappingEditorComponent;
  let fixture: ComponentFixture<DynamicMappingEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicMappingEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicMappingEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
