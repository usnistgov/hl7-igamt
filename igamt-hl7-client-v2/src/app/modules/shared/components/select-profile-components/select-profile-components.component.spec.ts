import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectProfileComponentsComponent } from './select-profile-components.component';

describe('SelectProfileComponentsComponent', () => {
  let component: SelectProfileComponentsComponent;
  let fixture: ComponentFixture<SelectProfileComponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectProfileComponentsComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectProfileComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
