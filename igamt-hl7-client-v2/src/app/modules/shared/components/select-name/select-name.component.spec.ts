import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectNameComponent } from './select-name.component';

describe('SelectNameComponent', () => {
  let component: SelectNameComponent;
  let fixture: ComponentFixture<SelectNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
