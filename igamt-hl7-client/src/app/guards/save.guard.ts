/**
 * Created by ena3 on 5/10/18.
 */
import { CanDeactivate } from '@angular/router';
import {Injectable, Component} from '@angular/core';
import {WithSave} from "./with.save.interface";
import {ConfirmationService} from 'primeng/components/common/api';

import {Md5} from 'ts-md5/dist/md5';

@Injectable()
export class SaveFormsGuard implements CanDeactivate<WithSave> {
  constructor(private confirmationService: ConfirmationService) {
  }


  canDeactivate(component: WithSave):Promise<any> {
    return new Promise((resolve, reject) => {
      if (!component.isValid()) {
        console.log("invalid form");

        this.getDialog(component, resolve , reject);
      }
      else if (this.compareHash(component.getBackup(), component.getCurrent())) {
        resolve(true);

      }else{

        component.save().then(x=>{
          console.log("Segment saved");
          resolve(true);
        },error=>{
          console.log("error saving");
          reject(false);

        })
      }
    });

  }
  compareHash(obj1:any, obj2:any):boolean{
    return Md5.hashStr(JSON.stringify(obj1))==Md5.hashStr(JSON.stringify(obj2))
  }

  getDialog(component,resolve,reject){
      this.confirmationService.confirm({
        message: "You have invalid Data. You cannot leave the page. Please fix you data ",
        accept: () => {

          resolve(false);
        },
        reject: () => {
          resolve(false);
        }
      });
  }


}
