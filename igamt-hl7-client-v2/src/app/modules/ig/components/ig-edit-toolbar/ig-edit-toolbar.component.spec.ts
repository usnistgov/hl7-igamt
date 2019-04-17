import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgEditToolbarComponent } from './ig-edit-toolbar.component';

describe('IgEditToolbarComponent', () => {
  let component: IgEditToolbarComponent;
  let fixture: ComponentFixture<IgEditToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgEditToolbarComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgEditToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
