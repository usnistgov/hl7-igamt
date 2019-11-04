import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {TabViewModule} from 'primeng/tabview';


import { DefaultConfigurationComponent } from './default-configuration.component';

describe('DefaultConfigurationComponent', () => {
  let component: DefaultConfigurationComponent;
  let fixture: ComponentFixture<DefaultConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
