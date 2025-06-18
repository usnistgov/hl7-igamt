import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteListConfirmationComponent } from './delete-list-confirmation.component';

describe('DeleteListConfirmationComponent', () => {
  let component: DeleteListConfirmationComponent;
  let fixture: ComponentFixture<DeleteListConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteListConfirmationComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteListConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
