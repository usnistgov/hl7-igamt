import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyResourceComponent } from './copy-resource.component';

describe('CopyResourceComponent', () => {
  let component: CopyResourceComponent;
  let fixture: ComponentFixture<CopyResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyResourceComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
