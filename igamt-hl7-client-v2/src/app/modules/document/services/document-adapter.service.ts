import { Injectable } from '@angular/core';
import {Scope} from '../../shared/constants/scope.enum';
import {Type} from '../../shared/constants/type.enum';

@Injectable({
  providedIn: 'root',
})
export class DocumentAdapterService {

  constructor() { }
  getEndPoint(type: Type, scope: Scope ) {
    switch (type) {
      case Type.IGDOCUMENT :
        return '/api/igdocuments/';
        break;
      case Type.DATATYPELIBRARY :
        return 'api/datatype-library/';
        break;
      default : return null;
                break;
    }

}
}
