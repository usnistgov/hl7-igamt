import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeSetTableComponent } from './code-set-table.component';

describe('CodeSetTableComponent', () => {
  let component: CodeSetTableComponent;
  let fixture: ComponentFixture<CodeSetTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeSetTableComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeSetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
