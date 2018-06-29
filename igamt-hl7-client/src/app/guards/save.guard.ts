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

        this.getInvalidDataDialog(component, resolve , reject);
      }else if (this.compareHash(component.getBackup(), component.getCurrent())) {
        resolve(true);

      }else{
         this.getUnsavedDialog(component,resolve,reject);
       }
    });

  }
  compareHash(obj1:any, obj2:any):boolean{

    return Md5.hashStr(JSON.stringify(obj1))==Md5.hashStr(JSON.stringify(obj2))
  }

  getInvalidDataDialog(component,resolve,reject){
      this.confirmationService.confirm({
        header:"Invalid Data",
        message: "You have Invalid Data, please fix your data before leaving",
        key :'INVALIDDATA',
        accept: () => {

          resolve(false);
        },
        reject: () => {
          resolve(false);
        }
      });
  }




  getUnsavedDialog(component,resolve,reject){
    this.confirmationService.confirm({
      header:"Unsaved Data",
      message: "You have Unsaved Data, Do you want to save and continue?",
      key :'UNSAVEDDATA',
      accept: () => {
        component.save().then(x=>{
          resolve(true);
        },error=>{
          console.log("error saving");
        })
      },
      reject: (cancel:boolean) => {
        resolve(false);
        // console.log(cancel);
        // if(cancel){
        //   console.log("canceling");
        //
        //   resolve(false);
        //
        // }else {
        //
        //
        //   console.log("Rejecting ");
        //   component.reset();
        //   resolve(true);
        // }

      }

    });
  }

}
