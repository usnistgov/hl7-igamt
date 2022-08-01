import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkspaceComponent } from './create-workspace.component';

describe('CreateWorkspaceComponent', () => {
  let component: CreateWorkspaceComponent;
  let fixture: ComponentFixture<CreateWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
