import {Component} from '@angular/core';
import {Message} from 'primeng/primeng';

@Component({
    templateUrl: './filedemo.html'
})
export class FileDemo {
    
    msgs: Message[];
    
    uploadedFiles: any[] = [];

    onUpload(event) {
        for(let file of event.files) {
            this.uploadedFiles.push(file);
        }
        
        this.msgs = [];
        this.msgs.push({severity: 'info', summary: 'File Uploaded', detail: ''});
    }
}