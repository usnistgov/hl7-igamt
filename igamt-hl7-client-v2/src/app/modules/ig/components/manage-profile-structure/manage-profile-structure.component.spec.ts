import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProfileStructureComponent } from './manage-profile-structure.component';

describe('ManageProfileStructureComponent', () => {
  let component: ManageProfileStructureComponent;
  let fixture: ComponentFixture<ManageProfileStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageProfileStructureComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProfileStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
