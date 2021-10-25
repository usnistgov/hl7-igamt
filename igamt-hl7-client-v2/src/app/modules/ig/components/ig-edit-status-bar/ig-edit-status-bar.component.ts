import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EditorVerify } from 'src/app/modules/dam-framework/store';
import { selectIsBottomDrawerCollapsed } from '../../../dam-framework/store/data/dam.selectors';
import { Severity } from '../../../shared/models/verification.interface';
import { IStatusBarInfo, VerificationService } from '../../../shared/services/verification.service';

@Component({
  selector: 'app-ig-edit-status-bar',
  templateUrl: './ig-edit-status-bar.component.html',
  styleUrls: ['./ig-edit-status-bar.component.scss'],
})
export class IgEditStatusBarComponent implements OnInit {
  SEVERITY = Severity;
  editorVerification$: Observable<IStatusBarInfo>;
  isDrawerActive$: Observable<boolean>;

  constructor(protected store: Store<any>, protected verificationService: VerificationService) {
    this.editorVerification$ = this.verificationService.getEditorStatusBarInfo();
    this.isDrawerActive$ = store.select(selectIsBottomDrawerCollapsed).pipe(map((a) => !a));
  }

  editorVerify() {
    this.store.dispatch(new EditorVerify());
  }

  ngOnInit(): void {
  }

}
