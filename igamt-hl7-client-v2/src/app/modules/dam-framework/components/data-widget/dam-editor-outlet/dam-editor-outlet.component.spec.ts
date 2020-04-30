import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamEditorOutletComponent } from './dam-editor-outlet.component';

describe('DamEditorOutletComponent', () => {
  let component: DamEditorOutletComponent;
  let fixture: ComponentFixture<DamEditorOutletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamEditorOutletComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamEditorOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
