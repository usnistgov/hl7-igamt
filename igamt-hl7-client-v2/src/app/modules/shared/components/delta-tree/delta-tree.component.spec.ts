import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeltaTreeComponent } from './delta-tree.component';

describe('DeltaTreeComponent', () => {
  let component: DeltaTreeComponent;
  let fixture: ComponentFixture<DeltaTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeltaTreeComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeltaTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
