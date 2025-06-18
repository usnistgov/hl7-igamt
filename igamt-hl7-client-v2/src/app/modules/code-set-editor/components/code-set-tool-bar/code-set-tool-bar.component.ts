import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCodeSetIsViewOnly } from 'src/app/root-store/code-set-editor/code-set-edit/code-set-edit.selectors';

@Component({
  selector: 'app-code-set-tool-bar',
  templateUrl: './code-set-tool-bar.component.html',
  styleUrls: ['./code-set-tool-bar.component.css'],
})
export class CodeSetToolBarComponent implements OnInit {

  viewOnly$: Observable<boolean>;

  constructor(private store: Store<any>) {
    this.viewOnly$ = this.store.select(selectCodeSetIsViewOnly);
  }

  ngOnInit() { }

}
