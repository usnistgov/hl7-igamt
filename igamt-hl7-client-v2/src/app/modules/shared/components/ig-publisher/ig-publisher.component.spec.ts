import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgPublisherComponent } from './ig-publisher.component';

describe('IgPublisherComponent', () => {
  let component: IgPublisherComponent;
  let fixture: ComponentFixture<IgPublisherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgPublisherComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgPublisherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
