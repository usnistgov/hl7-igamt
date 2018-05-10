/**
 * Created by ena3 on 5/10/18.
 */
import { CanDeactivate } from '@angular/router';
import {Injectable, Component} from '@angular/core';
import {WithSave} from "../../../with.save.interface";

import {Md5} from 'ts-md5/dist/md5';

@Injectable()
export class SaveFormsGuard implements CanDeactivate<WithSave> {

  canDeactivate(component: WithSave) {
    console.log("Called Desactivate");
    return this.compareHash(component.backup, component.getCurrent());
  }

  compareHash(obj1:any, obj2:any):boolean{
    return Md5.hashStr(JSON.stringify(obj1))==Md5.hashStr(JSON.stringify(obj2))
  }
}
