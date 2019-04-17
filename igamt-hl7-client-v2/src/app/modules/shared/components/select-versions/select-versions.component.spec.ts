import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectVersionsComponent } from './select-versions.component';

describe('SelectVersionsComponent', () => {
  let component: SelectVersionsComponent;
  let fixture: ComponentFixture<SelectVersionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectVersionsComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
