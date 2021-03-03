import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponentStructureTreeComponent } from './profile-component-structure-tree.component';

describe('ProfileComponentStructureTreeComponent', () => {
  let component: ProfileComponentStructureTreeComponent;
  let fixture: ComponentFixture<ProfileComponentStructureTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileComponentStructureTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponentStructureTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
