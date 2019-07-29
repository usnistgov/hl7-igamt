import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationTocComponent } from './configuration-toc.component';

describe('ConfigurationTocComponent', () => {
  let component: ConfigurationTocComponent;
  let fixture: ComponentFixture<ConfigurationTocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationTocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationTocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
