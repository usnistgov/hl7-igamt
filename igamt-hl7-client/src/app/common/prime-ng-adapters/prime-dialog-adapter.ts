/**
 * Created by hnt5 on 10/5/17.
 */
import {Subject} from "rxjs";

export abstract class PrimeDialogAdapter {
    _visible : boolean;
    result$ : Subject<any>;
    parent  : any;

    constructor(){

    }

    open(data){
        this.initResolvedData(data);
        this.onDialogOpen();
        this._visible  = true;
        this.result$ = new Subject();
        this.result$.subscribe(
            complete => {
                this._visible = false;
            }
        );
        return this.result$;
    }

    abstract onDialogOpen();

    protected hook(parent){
        this.parent = parent;
    }

    protected initResolvedData(data){
        for(let k in data){
            if(data.hasOwnProperty(k) && this.parent.hasOwnProperty(k)){
                this.parent[k] = data[k];
            }
        }
    }

    protected dismissWithNoData(){
        this.result$.complete();
    }

    protected dismissWithData(result){
        this.result$.next(result);
        this.result$.complete();
    }

}