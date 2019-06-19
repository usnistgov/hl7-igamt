import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Observable, throwError} from 'rxjs';
import {Message, MessageType, UserMessage} from '../../core/models/message/message.class';
import {Type} from '../constants/type.enum';
import {IReferenceLocation, IRelationShip, IUsages} from '../models/cross-reference';

@Injectable({
  providedIn: 'root',
})
export class CrossReferencesService {

  constructor(private http: HttpClient, private store: Store<any>) {

  }

  findUsages(documentId: string, documentType: Type, elementType: Type, elementId: string): Observable<Message<IRelationShip[]>> {

    const url = this.getUsageUrl(documentId, documentType, elementType, elementId);
    if ( url == null ) {
      return throwError(new UserMessage(MessageType.FAILED, 'Unsupperted URL'));
    } else {
      return this.http.get<Message<IRelationShip[]>>(this.getUsageUrl(documentId, documentType, elementType, elementId));
    }
  }

  getUsageUrl(documentId: string, documentType: Type, elementType: Type, elementId: string): string {
    if (documentType === Type.IGDOCUMENT) {
      return  'api/igdocuments/' + documentId + '/' + elementType + '/' + elementId + '/usage' ;
    } else { return null; }
  }

  // getUsagesFromRelationShip(relations: Observable<IRelationShip>): Observable<IUsages> {
  //   return relations.pipe(
  //     mergeMap((x: IRelationShip) => {
  //         return {
  //           usage: x.usage;
  //           location: x.location;
  //         }
  //
  //     }
  //   )
  //
  // }
}
