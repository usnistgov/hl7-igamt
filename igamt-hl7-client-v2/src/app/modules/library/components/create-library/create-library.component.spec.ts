import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateIGComponent} from './create-library.component';

describe('CreateIGComponent', () => {
  let component: CreateIGComponent;
  let fixture: ComponentFixture<CreateIGComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateIGComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateIGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
