import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponentStructureEditorComponent } from './profile-component-structure-editor.component';

describe('ProfileComponentStructureEditorComponent', () => {
  let component: ProfileComponentStructureEditorComponent;
  let fixture: ComponentFixture<ProfileComponentStructureEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileComponentStructureEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponentStructureEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
