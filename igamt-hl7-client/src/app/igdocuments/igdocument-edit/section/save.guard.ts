/**
 * Created by ena3 on 5/10/18.
 */
import { CanDeactivate } from '@angular/router';
import {Injectable, Component} from '@angular/core';

@Injectable()
export class SaveFormsGuard implements CanDeactivate<Component> {

  canDeactivate(component: Component) {
    console.log("Called Desactivate");
    console.log(component);
    return true;
  }

}
