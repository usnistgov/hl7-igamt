import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConformanceProfileStructureEditorComponent } from './conformance-profile-structure-editor.component';

describe('ConformanceProfileStructureEditorComponent', () => {
  let component: ConformanceProfileStructureEditorComponent;
  let fixture: ComponentFixture<ConformanceProfileStructureEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConformanceProfileStructureEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConformanceProfileStructureEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
