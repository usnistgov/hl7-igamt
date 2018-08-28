import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteElementComponent } from './delete-element.component';

describe('DeleteElementComponent', () => {
  let component: DeleteElementComponent;
  let fixture: ComponentFixture<DeleteElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
