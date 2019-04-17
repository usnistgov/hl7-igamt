import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityBagdeComponent } from './entity-bagde.component';

describe('EntityBagdeComponent', () => {
  let component: EntityBagdeComponent;
  let fixture: ComponentFixture<EntityBagdeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntityBagdeComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityBagdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
