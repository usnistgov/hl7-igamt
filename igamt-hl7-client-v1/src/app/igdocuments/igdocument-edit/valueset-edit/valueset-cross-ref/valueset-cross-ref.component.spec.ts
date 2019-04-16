import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuesetCrossRefComponent } from './valueset-cross-ref.component';

describe('ValuesetCrossRefComponent', () => {
  let component: ValuesetCrossRefComponent;
  let fixture: ComponentFixture<ValuesetCrossRefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValuesetCrossRefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuesetCrossRefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
