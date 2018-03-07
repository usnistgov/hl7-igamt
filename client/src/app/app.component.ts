import {Component,AfterViewInit,ElementRef,Renderer,ViewChild} from '@angular/core';
import {WorkspaceService} from "./service/workspace/workspace.service";
import {HttpModule} from "@angular/http";
import {AppInfoService} from "./appinfo.service";

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
  styleUrls: ['./app.component.css']
})
export class AppComponent{



  constructor(public renderer: Renderer, private workSpace :WorkspaceService ,private http: HttpModule ,private appInfo :AppInfoService
  ) {
        this.appInfo.getInfo().then(info => {
          console.log(info);

          this.workSpace.setAppInfo(info)})



  }

}
