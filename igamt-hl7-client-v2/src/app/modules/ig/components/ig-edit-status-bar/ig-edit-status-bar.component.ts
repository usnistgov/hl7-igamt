import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EditorVerify } from 'src/app/modules/dam-framework/store';
import { selectActiveVerificationTab } from '../../../../root-store/dam-igamt/igamt.selectors';
import { ExpandBottomDrawer, SetUIStateValue } from '../../../dam-framework/store/data/dam.actions';
import { selectIsBottomDrawerCollapsed } from '../../../dam-framework/store/data/dam.selectors';
import { Severity } from '../../../shared/models/verification.interface';
import { IStatusBar, VerificationService, VerificationTab } from '../../../shared/services/verification.service';

@Component({
  selector: 'app-ig-edit-status-bar',
  templateUrl: './ig-edit-status-bar.component.html',
  styleUrls: ['./ig-edit-status-bar.component.scss'],
})
export class IgEditStatusBarComponent implements OnInit {
  TAB = VerificationTab;
  SEVERITY = Severity;
  statusBar$: Observable<IStatusBar>;
  activeTab$: Observable<VerificationTab>;

  constructor(protected store: Store<any>, protected verificationService: VerificationService) {
    this.statusBar$ = this.verificationService.getStatusBarInfo();
    this.activeTab$ = combineLatest(
      this.verificationService.getBottomDrawerActive(),
      this.store.select(selectIsBottomDrawerCollapsed),
      this.store.select(selectActiveVerificationTab),
    ).pipe(
      map(([active, collapsed, tab]) => {
        return active && !collapsed ? tab : undefined;
      }),
    );
  }

  openVerificationTab(tab: VerificationTab, canOpen: boolean) {
    if (canOpen) {
      this.store.dispatch(new SetUIStateValue({ activeVerificationTab: tab }));
      this.store.dispatch(new ExpandBottomDrawer());
    }
  }

  editorVerify = () => {
    this.store.dispatch(new EditorVerify());
  }

  ngOnInit(): void {
  }

}
