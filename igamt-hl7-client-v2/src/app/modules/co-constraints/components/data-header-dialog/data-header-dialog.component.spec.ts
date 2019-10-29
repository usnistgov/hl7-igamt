import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataHeaderDialogComponent } from './data-header-dialog.component';

describe('DataHeaderDialogComponent', () => {
  let component: DataHeaderDialogComponent;
  let fixture: ComponentFixture<DataHeaderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataHeaderDialogComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataHeaderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
