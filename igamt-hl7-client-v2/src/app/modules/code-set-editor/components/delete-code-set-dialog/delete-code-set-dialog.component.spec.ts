import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCodeSetDialogComponent } from './delete-code-set-dialog.component';

describe('DeleteCodeSetDialogComponent', () => {
  let component: DeleteCodeSetDialogComponent;
  let fixture: ComponentFixture<DeleteCodeSetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteCodeSetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCodeSetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
