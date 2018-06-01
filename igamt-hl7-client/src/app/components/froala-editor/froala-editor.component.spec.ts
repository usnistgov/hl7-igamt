import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FroalaEditorComponent } from './froala-editor.component';

describe('FroalaEditorComponent', () => {
  let component: FroalaEditorComponent;
  let fixture: ComponentFixture<FroalaEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FroalaEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FroalaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
