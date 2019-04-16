/**
 * Created by ena3 on 7/22/18.
 */
import {Injectable}  from "@angular/core";
import {BehaviorSubject} from "rxjs";


@Injectable()
export class LoadingService{

  public loading :BehaviorSubject<any> =new BehaviorSubject(false);


  constructor(){

  }

  show(){

    this.loading.next(true);

  }




  hide(){

    this.loading.next(false);

  }

}
