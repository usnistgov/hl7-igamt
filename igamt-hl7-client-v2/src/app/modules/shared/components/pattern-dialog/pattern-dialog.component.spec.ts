import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternDialogComponent } from './pattern-dialog.component';

describe('PatternDialogComponent', () => {
  let component: PatternDialogComponent;
  let fixture: ComponentFixture<PatternDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatternDialogComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatternDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
