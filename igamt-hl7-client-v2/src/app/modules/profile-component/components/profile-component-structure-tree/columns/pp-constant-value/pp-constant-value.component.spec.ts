import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpConstantValueComponent } from './pp-constant-value.component';

describe('PpConstantValueComponent', () => {
  let component: PpConstantValueComponent;
  let fixture: ComponentFixture<PpConstantValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpConstantValueComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpConstantValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
