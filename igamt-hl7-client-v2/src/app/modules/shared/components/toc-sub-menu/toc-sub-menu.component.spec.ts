import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TocSubMenuComponent } from './toc-sub-menu.component';

describe('TocSubMenuComponent', () => {
  let component: TocSubMenuComponent;
  let fixture: ComponentFixture<TocSubMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TocSubMenuComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TocSubMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
