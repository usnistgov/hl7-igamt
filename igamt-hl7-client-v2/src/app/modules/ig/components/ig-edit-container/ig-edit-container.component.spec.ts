import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgEditContainerComponent } from './ig-edit-container.component';

describe('IgEditContainerComponent', () => {
  let component: IgEditContainerComponent;
  let fixture: ComponentFixture<IgEditContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgEditContainerComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgEditContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
