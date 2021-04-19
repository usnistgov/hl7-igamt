import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponentMetadataComponent } from './profile-component-metadata.component';

describe('ProfileComponentMetadataComponent', () => {
  let component: ProfileComponentMetadataComponent;
  let fixture: ComponentFixture<ProfileComponentMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileComponentMetadataComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponentMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
