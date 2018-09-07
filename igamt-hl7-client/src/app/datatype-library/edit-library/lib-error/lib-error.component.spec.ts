import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgErrorComponent } from './lib-error.component';

describe('IgErrorComponent', () => {
  let component: IgErrorComponent;
  let fixture: ComponentFixture<IgErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
