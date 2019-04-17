import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgListItemCardComponent } from './ig-list-item-card.component';

describe('IgListItemCardComponent', () => {
  let component: IgListItemCardComponent;
  let fixture: ComponentFixture<IgListItemCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IgListItemCardComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgListItemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
