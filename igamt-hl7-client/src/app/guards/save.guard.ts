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


  canDeactivate(component: WithSave):Promise<any>{
    console.log("Called Can Deactivate");
      try{

        if (!component.isValid()) {
          console.log("invalid form");
          return this.getInvalidDataDialog(component);

        }else if (!component.hasChanged()) {

          return  Promise.resolve(true);
        }else{

          return  this.getUnsavedDialog(component);

        }
      }catch (e){
        console.log("Error");
        console.log(e);
        return this.somthingWrong();
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
        message: "You have unsaved changes: If you leave this page,Your changes will be lost, do you want to continue?",
        key: 'UNSAVEDDATA',
        accept: () => {
          // component.save().then(x => {
          //   resolve(true);
          // }, error => {
          //   console.log("error");
          //   resolve(false);
          //
          // })
          resolve(true);
        },
        reject: (cancel: boolean) => {
          reject(false);
        }
      });
    });
    return pr;

  }


  somthingWrong() :Promise<any>{

    var pr = new Promise<any>((resolve, reject) => {

      this.confirmationService.confirm({
        header: "Navigation Error",
        message: "Something worng had happened, Do you want to continue? ",
        key: 'UNSAVEDDATA',
        accept: () => {
          resolve(true);

        },
        reject: (cancel: boolean) => {
          reject("navigation error");
        }
      });
    });
    return pr;

  }

}
