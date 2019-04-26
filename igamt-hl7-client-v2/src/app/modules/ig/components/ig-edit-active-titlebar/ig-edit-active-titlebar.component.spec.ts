import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgEditActiveTitlebarComponent } from './ig-edit-active-titlebar.component';

describe('IgEditActiveTitlebarComponent', () => {
  let component: IgEditActiveTitlebarComponent;
  let fixture: ComponentFixture<IgEditActiveTitlebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgEditActiveTitlebarComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgEditActiveTitlebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
