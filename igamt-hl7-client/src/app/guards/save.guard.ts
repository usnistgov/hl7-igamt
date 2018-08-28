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


  constructor(private confirmationService: ConfirmationService){
  }

  canDeactivate(component: WithSave):Promise<any>{
      console.log("Called Can Deactivate");
      try{
        if (!component.isValid()) {
          console.log("invalid form");
          return this.getInvalidDataDialog(component);

        }else if (this.compareHash(component.getBackup(), component.getCurrent())) {
          return  Promise.resolve(true);
        }else{
          return  this.getUnsavedDialog(component);
        }
      }catch (e){
        return this.somethingWrong();
      }
  }

  compareHash(obj1:any, obj2:any):boolean{

    return Md5.hashStr(JSON.stringify(obj1))==Md5.hashStr(JSON.stringify(obj2))
  }

  getInvalidDataDialog(component):Promise<any>{
    var pr  =new Promise<any>((resolve, reject) => {


      this.confirmationService.confirm({
        header: "Invalid Data",
        message: "You have Invalid Data, please fix your data before leaving",
        key: 'INVALIDDATA',
        accept: () => {
          resolve(false);
        },
        reject: () => {
          reject();
        }
      });
    });

    return pr;
  }

  getUnsavedDialog(component) :Promise<any>{

    var pr = new Promise<any>((resolve, reject) => {

      this.confirmationService.confirm({
        header: "Unsaved Data",
        message: "You have unsaved Data, Do you want to save and continue?",
        key: 'UNSAVEDDATA',
        accept: () => {
          component.save().then(x => {
            resolve(true);
          }, error => {

            resolve(false);
          })
        },
        reject: (cancel: boolean) => {
          resolve(false);
        }
      });
    });
    return pr;
  }


  somethingWrong() :Promise<any>{

    var pr = new Promise<any>((resolve, reject) => {
      this.confirmationService.confirm({
        header: "Navigation Error",
        message: "Something wrong had happened, Do you want to continue? ",
        key: 'UNSAVEDDATA',
        accept: () => {
          resolve(true);
        },
        reject: (cancel: boolean) => {
          resolve(false);
        }
      });
    });
    return pr;
  }



}
