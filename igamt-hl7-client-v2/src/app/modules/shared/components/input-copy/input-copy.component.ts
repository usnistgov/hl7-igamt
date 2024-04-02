import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-input-copy',
    templateUrl: './input-copy.component.html',
    styleUrls: ['./input-copy.component.css'],
})

export class InputCopyComponent implements OnInit {

    @Input()
    label: string;
    @Input()
    type: string;
    @Input()
    value: string;
    @Input()
    container: string;

    constructor() { }

    copy(p) {
        window.navigator['clipboard'].writeText(this.value);
        p.open();
        setTimeout(() => {
            p.close();
        }, 500);
    }

    ngOnInit() { }
}
