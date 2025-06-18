import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeSetManagementComponent } from './code-set-management.component';

describe('CodeSetManagementComponent', () => {
  let component: CodeSetManagementComponent;
  let fixture: ComponentFixture<CodeSetManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeSetManagementComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeSetManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
