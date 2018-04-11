import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
/**
 * Created by hnt5 on 10/25/17.
 */
import {Md5} from 'ts-md5/dist/md5';
import {TreeNode} from "primeng/components/common/treenode";

export class Entity {
  public static  IG: string ="IG";
  public static  SEGMENT: string= "SEGMENT";
  public static  DATATYPE :string= "DATATYPE";
  public static  CURRENTNODE :string= "CurrentNode";


  /* ADD ENTITY TYPE TO SUPPORT HERE */
}


@Injectable()
export class WorkspaceService {
  private currentHash;
  private currentObj;
  private appInfo;


  private map : { [index : string] : BehaviorSubject<any> };

  constructor(private http : Http){
    this.map={}
  }



  getCurrent(key : string){
    return this.map[key];
  }

  getAppInfo(){
    return this.appInfo;

  }
  setAppInfo(info:any){
    this.appInfo= info;
  }

  setCurrent(key : string, obj : any){
    let str=JSON.stringify(obj);
    this.currentHash=Md5.hashStr(str);
    if(this.map[key]){
      this.map[key].next(obj);
    }else{
      let elm=new BehaviorSubject<any>(obj);
      this.map[key] = elm;
    }


  }


  getPreviousHash(){
    console.log(this.currentHash);
    return this.currentHash;
  }


}
