import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcValueSetCellComponent } from './cc-value-set-cell.component';

describe('CcValueSetCellComponent', () => {
  let component: CcValueSetCellComponent;
  let fixture: ComponentFixture<CcValueSetCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcValueSetCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcValueSetCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
