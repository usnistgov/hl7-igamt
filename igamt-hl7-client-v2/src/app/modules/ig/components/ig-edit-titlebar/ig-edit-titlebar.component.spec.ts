import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgEditTitlebarComponent } from './ig-edit-titlebar.component';

describe('IgEditTitlebarComponent', () => {
  let component: IgEditTitlebarComponent;
  let fixture: ComponentFixture<IgEditTitlebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgEditTitlebarComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgEditTitlebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
