/**
 * Created by hnt5 on 10/16/17.
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'dtFlavor'})
export class DtFlavorPipe implements PipeTransform {
    transform(list : any[], base : string) : any[] {
        if(list && base){
            return list.filter(node => node.label.startsWith(base));
        }
        return [];
    }
}
