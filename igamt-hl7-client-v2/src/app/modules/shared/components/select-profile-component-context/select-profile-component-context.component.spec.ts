import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectProfileComponentContextComponent } from './select-profile-component-context.component';

describe('SelectProfileComponentContextComponent', () => {
  let component: SelectProfileComponentContextComponent;
  let fixture: ComponentFixture<SelectProfileComponentContextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectProfileComponentContextComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectProfileComponentContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
