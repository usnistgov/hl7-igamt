import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { from, Observable, throwError } from 'rxjs';
import { map, mergeMap, take, toArray } from 'rxjs/operators';
import { MessageType, UserMessage } from '../../dam-framework/models/messages/message.class';
import { Type } from '../constants/type.enum';
import { IDocumentRef } from '../models/abstract-domain.interface';
import { IRelationShip, IUsages } from '../models/cross-reference';
import { IDisplayElement } from '../models/display-element.interface';
import { StoreResourceRepositoryService } from './resource-repository.service';

@Injectable({
  providedIn: 'root',
})
export class CrossReferencesService {

  constructor(
    private http: HttpClient,
    private store: Store<any>,
    private resourceRepo: StoreResourceRepositoryService,
  ) { }

  findUsages(documentRef: IDocumentRef, documentType: Type, elementType: Type, elementId: string): Observable<IRelationShip[]> {
    const url = this.getUsageUrl(documentRef.documentId, documentType, elementType, elementId);
    if (url == null) {
      return throwError(new UserMessage(MessageType.FAILED, 'Unsupperted URL'));
    } else {
      return this.http.get<IRelationShip[]>(this.getUsageUrl(documentRef.documentId, documentType, elementType, elementId));
    }
  }

  getUsageUrl(documentId: string, documentType: Type, elementType: Type, elementId: string): string {
    if (documentType === Type.IGDOCUMENT) {
      return 'api/igdocuments/' + documentId + '/' + elementType + '/' + elementId + '/usage';
    } else if (documentType === Type.DATATYPELIBRARY) {
      return 'api/datatype-library/' + documentId + '/' + elementType + '/' + elementId + '/usage';
    } else { return null; }
  }

  getUsagesFromRelationShip(relations: IRelationShip[]): Observable<IUsages[]> {
    return from(relations).pipe(
      mergeMap((r: IRelationShip) => {
        return this.resourceRepo.getResourceDisplay(r.parent.type, r.parent.id).pipe(
          take(1),
          map((elm: IDisplayElement) => {
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

  findUsagesDisplay = (documentId: IDocumentRef, documentType: Type, elementType: Type, elementId: string): Observable<IUsages[]> => {
    return this.findUsages(documentId, documentType, elementType, elementId).pipe(
      take(1),
      mergeMap((rel: IRelationShip[]) => {
        return this.getUsagesFromRelationShip(rel);
      },
      ),
    );
  }
}
