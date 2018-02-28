import {Component} from '@angular/core';
import {Message} from 'primeng/primeng';

@Component({
    templateUrl: './messagesdemo.html'
})
export class MessagesDemo {

    msgs: Message[] = [];
    
    showInfo() {
        this.msgs = [];
        this.msgs.push({severity:'info', summary:'Info Message', detail:'PrimeNG rocks'});
    }

    showWarn() {
        this.msgs = [];
        this.msgs.push({severity:'warn', summary:'Warn Message', detail:'There are unsaved changes'});
    }

    showError() {
        this.msgs = [];
        this.msgs.push({severity:'error', summary:'Error Message', detail:'Validation failed'});
    }
    
    showSuccess() {
        this.msgs = [];
        this.msgs.push({severity:'success', summary:'Success Message', detail:'Message sent'});
    }

    showMultiple() {
        this.msgs = [];
        this.msgs.push({severity:'info', summary:'Message 1', detail:'PrimeNG rocks'});
        this.msgs.push({severity:'info', summary:'Message 2', detail:'PrimeUI rocks'});
        this.msgs.push({severity:'info', summary:'Message 3', detail:'PrimeFaces rocks'});
    }
}