import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BindingSelectorComponent } from './binding-selector.component';

describe('BindingSelectorComponent', () => {
  let component: BindingSelectorComponent;
  let fixture: ComponentFixture<BindingSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BindingSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BindingSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
