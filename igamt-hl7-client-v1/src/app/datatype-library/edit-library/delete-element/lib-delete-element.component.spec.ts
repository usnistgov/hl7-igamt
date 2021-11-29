import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibDeleteElementComponent } from './lib-delete-element.component';

describe('LibDeleteElementComponent', () => {
  let component: LibDeleteElementComponent;
  let fixture: ComponentFixture<LibDeleteElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibDeleteElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibDeleteElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
