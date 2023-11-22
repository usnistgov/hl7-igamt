import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataAttributeConfigComponent } from './metadata-attribute-config.component';

describe('MetadataAttributeConfigComponent', () => {
  let component: MetadataAttributeConfigComponent;
  let fixture: ComponentFixture<MetadataAttributeConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetadataAttributeConfigComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataAttributeConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
