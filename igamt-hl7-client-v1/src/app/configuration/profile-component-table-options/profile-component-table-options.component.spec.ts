import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponentTableOptionsComponent } from './profile-component-table-options.component';

describe('ProfileComponentTableOptionsComponent', () => {
  let component: ProfileComponentTableOptionsComponent;
  let fixture: ComponentFixture<ProfileComponentTableOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileComponentTableOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponentTableOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
