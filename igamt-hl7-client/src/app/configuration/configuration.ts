import {Component} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    templateUrl: './configuration.component.html'
})
export class Configuration {

  fonts: any= {};
  constructor(private http: Http) {
    console.log('Config constructor');
    this.findFonts().subscribe(data => {
      this.fonts = data;
    });
  }

  findFonts() {
    return this.http.get('api/exportConfiguration/findFonts').map((res: Response) => res.json());
  }
}
