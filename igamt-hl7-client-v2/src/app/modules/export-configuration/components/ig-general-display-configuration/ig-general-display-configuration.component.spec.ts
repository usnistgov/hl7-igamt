import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgGeneralDisplayConfigurationComponent } from './ig-general-display-configuration.component';

describe('IgGeneralDisplayConfigurationComponent', () => {
  let component: IgGeneralDisplayConfigurationComponent;
  let fixture: ComponentFixture<IgGeneralDisplayConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgGeneralDisplayConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgGeneralDisplayConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
