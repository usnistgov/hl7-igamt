import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { selectLoadedDocumentInfo } from 'src/app/root-store/dam-igamt/igamt.selectors';
import { TurnOffLoader, TurnOnLoader } from '../../../dam-framework/store/loader/loader.actions';
import { ValueSetService } from '../../../value-set/service/value-set.service';
import { IDisplayElement } from '../../models/display-element.interface';
import { ICodes, IValueSet } from '../../models/value-set.interface';

@Component({
  selector: 'app-vs-code-picker',
  templateUrl: './vs-code-picker.component.html',
  styleUrls: ['./vs-code-picker.component.scss'],
})
export class VsCodePickerComponent implements OnInit {

  codes: Observable<any[]>;
  selectedValueSet: IDisplayElement;
  valueSets: IDisplayElement[];

  constructor(
    public dialogRef: MatDialogRef<VsCodePickerComponent>,
    private valueSetService: ValueSetService,
    private store: Store<any>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.valueSets = data.valueSets || [];
  }

  getById(id: string): Observable<IValueSet> {
    return this.store.select(selectLoadedDocumentInfo).pipe(
      take(1),
      mergeMap((x) => {
        return this.valueSetService.getById(x, id);
      }),
    );
  }

  selectValueSet(display: IDisplayElement) {
    this.store.dispatch(new TurnOnLoader({ blockUI: true }));
    this.getById(display.id).subscribe(
      (x) => {
        this.store.dispatch(new TurnOffLoader());
        this.codes = of([...x.codes]);
      },
      () => {
        this.store.dispatch(new TurnOffLoader());
      },
    );
  }

  clearSelectedValueSet() {
    this.selectedValueSet = null;
  }

  pick(code: ICodes) {
    this.dialogRef.close(code);
  }

  cancel() {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
