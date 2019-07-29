import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectResourceIdsComponent } from './select-resource-ids.component';

describe('SelectResourceIdsComponent', () => {
  let component: SelectResourceIdsComponent;
  let fixture: ComponentFixture<SelectResourceIdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectResourceIdsComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectResourceIdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
