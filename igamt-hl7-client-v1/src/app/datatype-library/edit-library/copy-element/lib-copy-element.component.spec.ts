import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibCopyElementComponent } from './lib-copy-element.component';

describe('LibCopyElementComponent', () => {
  let component: LibCopyElementComponent;
  let fixture: ComponentFixture<LibCopyElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibCopyElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibCopyElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
