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


  canDeactivate(component: WithSave)  {
     if(!this.compareHash(component.getBackup(), component.getCurrent())){
      if(!component.isValid()){

        return this.getDialog(component);
      }else{
        component.save();
        return true;

      }
     }else{
       return true;

     }
  }

  compareHash(obj1:any, obj2:any):boolean{
    return Md5.hashStr(JSON.stringify(obj1))==Md5.hashStr(JSON.stringify(obj2))
  }

  getDialog(component):Promise<any>{
    return new Promise((resolve, reject) => {
      this.confirmationService.confirm({
        message: "You have invalid Data. Are you sure you want to leave this page?",
        accept: () => {
          component.save();

          resolve(true);
        },
        reject: () => {
          resolve(false);
        }
      });
    });



  }
}
