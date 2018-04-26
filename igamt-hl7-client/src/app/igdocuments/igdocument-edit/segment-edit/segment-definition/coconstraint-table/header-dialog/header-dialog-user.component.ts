/**
 * Created by hnt5 on 10/16/17.
 */
import {Component} from "@angular/core";
import {PrimeDialogAdapter} from "../../../../../../common/prime-ng-adapters/prime-dialog-adapter";

@Component({
    selector : 'cc-header-dialog-user',
    templateUrl : 'header-dialog-user.template.html'
})
export class CCHeaderDialogUser extends PrimeDialogAdapter {

    header : string = "";

    constructor(){
        super();
    }

    addHeader(){
        this.dismissWithData({
            id : this.header.replace(' ','-'),
            label : this.header
        });
    }

    dismiss(){
        this.dismissWithNoData();
    }

    onDialogOpen(){
        this.header = '';
    }

    ngOnInit(){
        this.hook(this);
    }
}
