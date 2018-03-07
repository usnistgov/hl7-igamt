/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AppTopBar } from './app.topbar.component';
import { AppRightPanel} from './app.rightpanel.component';
import { InlineProfileComponent } from './app.profile.component';
import { AppFooter } from './app.footer.component';
import { AppMenuComponent, AppSubMenu } from './app.menu.component';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [ RouterTestingModule ],
        declarations: [ AppComponent, 
                AppTopBar, 
                AppMenuComponent,
                AppSubMenu,
                AppFooter, 
                InlineProfileComponent, 
                AppRightPanel 
            ],
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
