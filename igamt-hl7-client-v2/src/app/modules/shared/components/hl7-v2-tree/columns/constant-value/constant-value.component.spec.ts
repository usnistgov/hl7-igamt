import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstantValueComponent } from './constant-value.component';

describe('ConstantValueComponent', () => {
  let component: ConstantValueComponent;
  let fixture: ComponentFixture<ConstantValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstantValueComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstantValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
