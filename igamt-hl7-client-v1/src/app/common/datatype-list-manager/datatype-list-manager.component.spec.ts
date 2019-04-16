import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatypeListManagerComponent } from './datatype-list-manager.component';

describe('DatatypeListManagerComponent', () => {
  let component: DatatypeListManagerComponent;
  let fixture: ComponentFixture<DatatypeListManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatatypeListManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatypeListManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
