import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDeltaEditorComponent } from './entity-delta-editor.component';

describe('EntityDeltaEditorComponent', () => {
  let component: EntityDeltaEditorComponent;
  let fixture: ComponentFixture<EntityDeltaEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityDeltaEditorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityDeltaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
