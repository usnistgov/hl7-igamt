import {Component,Input,OnInit,EventEmitter,ViewChild,trigger,state,transition,style,animate} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {MenuItem} from 'primeng/primeng';

export class InlineProfileComponent {

    active: boolean;

    onClick(event) {
        this.active = !this.active;
        event.preventDefault();
    }
}
