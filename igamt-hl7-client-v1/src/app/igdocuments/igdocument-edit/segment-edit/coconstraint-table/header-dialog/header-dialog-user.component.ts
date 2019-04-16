/**
 * Created by hnt5 on 10/16/17.
 */
import {Component, OnInit} from '@angular/core';
import {PrimeDialogAdapter} from '../../../../../common/prime-ng-adapters/prime-dialog-adapter';
import {CellTemplate} from '../coconstraint.domain';

@Component({
    selector : 'app-cc-header-dialog-user',
    templateUrl : 'header-dialog-user.template.html'
})
export class CCHeaderDialogUserComponent extends PrimeDialogAdapter implements OnInit {

    header = '';

    constructor() {
        super();
    }

    addHeader() {
        this.dismissWithData({
            id : this.header.replace(' ', '-'),
            label : this.header,
            template: CellTemplate.TEXTAREA
        });
    }

    dismiss() {
        this.dismissWithNoData();
    }

    onDialogOpen() {
        this.header = '';
    }

    ngOnInit() {
        super.hook(this);
    }
}
