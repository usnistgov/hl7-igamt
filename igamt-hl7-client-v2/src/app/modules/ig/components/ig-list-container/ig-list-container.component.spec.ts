import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgListContainerComponent } from './ig-list-container.component';

describe('IgListContainerComponent', () => {
  let component: IgListContainerComponent;
  let fixture: ComponentFixture<IgListContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IgListContainerComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
