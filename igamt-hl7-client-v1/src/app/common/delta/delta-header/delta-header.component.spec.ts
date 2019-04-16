import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeltaHeaderComponent } from './delta-header.component';

describe('DeltaHeaderComponent', () => {
  let component: DeltaHeaderComponent;
  let fixture: ComponentFixture<DeltaHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeltaHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeltaHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
