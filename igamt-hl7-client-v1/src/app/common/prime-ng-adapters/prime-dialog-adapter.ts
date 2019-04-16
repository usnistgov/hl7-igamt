/**
 * Created by hnt5 on 10/5/17.
 */
import {Subject} from 'rxjs/Subject';

export abstract class PrimeDialogAdapter {
    _visible: boolean;
    result$: Subject<any>;
    parent: any;

    protected constructor() {
    }

    open(data) {
      console.log('Opening Dialog with data');
      console.log(data);
      console.log(data);
      this.initResolvedData(data);
      this.onDialogOpen();
      this._visible  = true;
      this.result$ = new Subject();
      const ctrl = this;
      this.result$.subscribe({
        complete() {
          ctrl._visible = false;
        }
      });
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


    protected dismissWithNoData() {
        this.result$.complete();
    }

    protected dismissWithData(result) {
      this.result$.next(result);
      this.result$.complete();
    }

}
