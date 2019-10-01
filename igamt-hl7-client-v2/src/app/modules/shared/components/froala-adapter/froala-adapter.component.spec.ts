import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FroalaAdapterComponent } from './froala-adapter.component';

describe('FroalaAdapterComponent', () => {
  let component: FroalaAdapterComponent;
  let fixture: ComponentFixture<FroalaAdapterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FroalaAdapterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FroalaAdapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
