import {Component, OnInit, Inject} from '@angular/core';
@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css']
})
export class ErrorDialogComponent implements OnInit {
  modalTitle: string;
  constructor( public data: any) {
    this.modalTitle = data.title;
    console.log(data)
  }
  ngOnInit() {
  }

}
