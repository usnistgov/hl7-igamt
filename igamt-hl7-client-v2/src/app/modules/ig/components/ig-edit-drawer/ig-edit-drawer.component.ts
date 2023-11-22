import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { IWorkspaceVerification } from 'src/app/modules/dam-framework';
import { selectWorkspaceVerification } from 'src/app/modules/dam-framework/store';
import { selectActiveVerificationTab } from 'src/app/root-store/dam-igamt/igamt.selectors';
import { CollapseBottomDrawer, SetUIStateValue } from '../../../dam-framework/store/data/dam.actions';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { IStatusBarInfo, IVerificationEntryTable, IVerificationStats, IVerificationTabData, VerificationService, VerificationTab } from '../../../shared/services/verification.service';

@Component({
  selector: 'app-ig-edit-drawer',
  templateUrl: './ig-edit-drawer.component.html',
  styleUrls: ['./ig-edit-drawer.component.scss'],
})
export class IgEditDrawerComponent implements OnInit, OnDestroy {

  sub: Subscription;
  value$: Observable<Record<string, IVerificationTabData>>;
  active$: Observable<VerificationTab>;
  tabs$: Observable<VerificationTab[]>;
  verification$: Observable<IWorkspaceVerification>;

  constructor(
    private verificationService: VerificationService,
    private repository: StoreResourceRepositoryService,
    private store: Store<any>,
  ) {
    this.active$ = this.store.select(selectActiveVerificationTab);
    this.tabs$ = this.verificationService.getBottomDrawerTabs();
    this.verification$ = this.store.select(selectWorkspaceVerification);
    this.value$ = this.tabs$.pipe(
      flatMap((tabs) => {
        return combineLatest(tabs.map((tab) => this.verificationService.getVerificationTabData(tab, this.repository).pipe(
          map((data) => ({
            tab,
            data,
          })),
        ))).pipe(
          map((tabValues) => {
            return tabValues.reduce((acc, tabValue) => {
              return {
                ...acc,
                [tabValue.tab]: tabValue.data,
              };
            }, {} as Record<string, IVerificationTabData>);
          }),
        );
      }),
    );
  }

  ngOnInit() {
    this.sub = combineLatest(
      this.store.select(selectActiveVerificationTab),
      this.verificationService.getBottomDrawerTabs(),
    ).pipe(
      tap(([active, tabs]) => {
        if ((!active || !tabs.includes(active))) {
          if (tabs.length > 0) {
            this.store.dispatch(new SetUIStateValue({ activeVerificationTab: tabs[0] }));
          } else {
            this.store.dispatch(new CollapseBottomDrawer());
          }
        }
      }),
    ).subscribe();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
