import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeltaColumnComponent } from './delta-column.component';

describe('DeltaColumnComponent', () => {
  let component: DeltaColumnComponent;
  let fixture: ComponentFixture<DeltaColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeltaColumnComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeltaColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
