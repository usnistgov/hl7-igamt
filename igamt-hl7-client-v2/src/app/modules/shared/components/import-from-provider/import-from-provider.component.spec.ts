import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFromProviderComponent } from './import-from-provider.component';

describe('ImportFromProviderComponent', () => {
  let component: ImportFromProviderComponent;
  let fixture: ComponentFixture<ImportFromProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportFromProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFromProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
