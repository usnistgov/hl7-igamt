import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {from, Observable, throwError} from 'rxjs';
import {concatMap, map, mergeMap, reduce, switchMap, take, tap, toArray} from 'rxjs/operators';
import {TurnOffLoader, TurnOnLoader} from '../../../root-store/loader/loader.actions';
import {Message, MessageType, UserMessage} from '../../core/models/message/message.class';
import {Type} from '../constants/type.enum';
import {IRelationShip, IUsages} from '../models/cross-reference';
import {IDisplayElement} from '../models/display-element.interface';
import {StoreResourceRepositoryService} from './resource-repository.service';

@Injectable({
  providedIn: 'root',
})
export class CrossReferencesService {

  constructor(private http: HttpClient, private store: Store<any>, private resourceRepo: StoreResourceRepositoryService) {

  }

  findUsages(documentId: string, documentType: Type, elementType: Type, elementId: string): Observable<IRelationShip[]> {

    const url = this.getUsageUrl(documentId, documentType, elementType, elementId);
    if (url == null) {
      return throwError(new UserMessage(MessageType.FAILED, 'Unsupperted URL'));
    } else {
      return this.http.get<IRelationShip[]>(this.getUsageUrl(documentId, documentType, elementType, elementId));
    }
  }

  getUsageUrl(documentId: string, documentType: Type, elementType: Type, elementId: string): string {
    if (documentType === Type.IGDOCUMENT) {
      return 'api/igdocuments/' + documentId + '/' + elementType + '/' + elementId + '/usage';
    } else {
      return null;
    }
  }

  getUsagesFromRelationShip(relations: IRelationShip[]): Observable<IUsages[]> {
        return from(relations).pipe(
          mergeMap((r: IRelationShip) => {
            this.store.dispatch(new TurnOnLoader({
              blockUI: true,
            }));
            return this.resourceRepo.getResourceDisplay(r.parent.type, r.parent.id).pipe(
              take(1),
              map((elm: IDisplayElement) => {
                this.store.dispatch(new TurnOffLoader());
                return {
                  usage: r.usage,
                  element: elm,
                  location: r.location,
                };
              }),
            );
          }),
          toArray(),
        );
  }

  findUsagesDisplay = (documentId: string, documentType: Type, elementType: Type, elementId: string): Observable<IUsages[]> => {
    return this.findUsages (documentId, documentType, elementType, elementId).pipe(

      mergeMap( (rel: IRelationShip[]) => {
        return this.getUsagesFromRelationShip(rel);
        },
        ),
    );
  }
}
