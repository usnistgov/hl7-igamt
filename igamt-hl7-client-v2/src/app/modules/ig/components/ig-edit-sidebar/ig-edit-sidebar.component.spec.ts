import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgEditSidebarComponent } from './ig-edit-sidebar.component';

describe('IgEditSidebarComponent', () => {
  let component: IgEditSidebarComponent;
  let fixture: ComponentFixture<IgEditSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgEditSidebarComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgEditSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
