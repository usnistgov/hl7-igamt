import {Component,AfterViewInit,ElementRef,Renderer,ViewChild} from '@angular/core';

enum MenuOrientation {
    STATIC,
    OVERLAY,
    SLIM,
    HORIZONTAL
};

declare var jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

}
