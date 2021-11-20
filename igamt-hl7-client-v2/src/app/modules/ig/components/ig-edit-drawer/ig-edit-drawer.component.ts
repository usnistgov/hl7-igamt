import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { selectActiveVerificationTab } from 'src/app/root-store/dam-igamt/igamt.selectors';
import { CollapseBottomDrawer, SetUIStateValue } from '../../../dam-framework/store/data/dam.actions';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { IVerificationEntryTable, VerificationService, VerificationTab } from '../../../shared/services/verification.service';

@Component({
  selector: 'app-ig-edit-drawer',
  templateUrl: './ig-edit-drawer.component.html',
  styleUrls: ['./ig-edit-drawer.component.scss'],
})
export class IgEditDrawerComponent implements OnInit, OnDestroy {

  sub: Subscription;
  value$: Observable<Record<string, IVerificationEntryTable>>;
  active$: Observable<VerificationTab>;
  tabs$: Observable<VerificationTab[]>;

  constructor(
    private verificationService: VerificationService,
    private repository: StoreResourceRepositoryService,
    private store: Store<any>,
  ) {
    this.active$ = this.store.select(selectActiveVerificationTab);
    this.tabs$ = this.verificationService.getBottomDrawerTabs();
    this.value$ = this.tabs$.pipe(
      flatMap((tabs) => {
        return combineLatest(tabs.map((tab) => this.verificationService.getEntryTable(tab, this.repository).pipe(
          map((table) => ({
            tab,
            table,
          })),
        ))).pipe(
          map((tabValues) => {
            return tabValues.reduce((acc, tabValue) => {
              return {
                ...acc,
                [tabValue.tab]: tabValue.table,
              };
            }, {} as Record<string, IVerificationEntryTable>);
          }),
        );
      }),
    );

    this.verificationService.getEditorVerificationEntryTable(repository);

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
