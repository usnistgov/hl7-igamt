import {Scope} from '../../../shared/constants/scope.enum';
import {EventTreeData} from '../message-event/message-event.class';
import {IDocumentMetaData} from './document-metadata.interface';

export interface IDocumentCreationWrapper {
  metadata: IDocumentMetaData;
  scope: Scope;
  msgEvts:  EventTreeData[];
}
