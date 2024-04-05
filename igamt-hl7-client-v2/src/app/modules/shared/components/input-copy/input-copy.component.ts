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
    copied = false;

    constructor() { }

    copy() {
        window.navigator['clipboard'].writeText(this.value);
        this.copied = true;
        setTimeout(() => {
            this.copied = false;
        }, 600);
    }

    ngOnInit() { }
}
