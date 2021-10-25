import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { StoreResourceRepositoryService } from '../../../shared/services/resource-repository.service';
import { IVerificationEntryTable, VerificationService } from '../../../shared/services/verification.service';

@Component({
  selector: 'app-ig-edit-drawer',
  templateUrl: './ig-edit-drawer.component.html',
  styleUrls: ['./ig-edit-drawer.component.scss'],
})
export class IgEditDrawerComponent implements OnInit {

  value$: Observable<IVerificationEntryTable>;

  constructor(
    private verificationService: VerificationService,
    private repository: StoreResourceRepositoryService,
    private store: Store<any>,
  ) {
    this.value$ = this.verificationService.getEditorVerificationEntryTable(repository);
  }

  ngOnInit() {
  }

}
