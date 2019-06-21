import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectValueSetsComponent } from './select-value-sets.component';

describe('SelectValueSetsComponent', () => {
  let component: SelectValueSetsComponent;
  let fixture: ComponentFixture<SelectValueSetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectValueSetsComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectValueSetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
