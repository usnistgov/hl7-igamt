import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IgTocComponent} from './ig-toc.component';

describe('IgTocComponent', () => {
  let component: IgTocComponent;
  let fixture: ComponentFixture<IgTocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IgTocComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgTocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
