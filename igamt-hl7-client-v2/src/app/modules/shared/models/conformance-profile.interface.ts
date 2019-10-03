import { IResourceBinding } from './binding.interface';
import { IComment } from './comment.interface';
import { IRef } from './ref.interface';
import { IResource } from './resource.interface';
import { IStructureElement } from './structure-element.interface';

export interface IMsgStructElement extends IStructureElement {
  min: number;
  max: string;
  comments: IComment[];
}

export interface IGroup extends IMsgStructElement {
  children: IMsgStructElement[];
}
export interface ISegmentRef extends IMsgStructElement {
  ref: IRef;
}
export interface IConformanceProfile extends IResource {
  identifier: string;
  messageType: string;
  event: string;
  structID: string;
  profileType: ProfileType;
  role: Role;
  profileIdentifier: IMessageProfileIdentifier[];
  children: IMsgStructElement[];
  binding?: IResourceBinding;
}

export enum Role {
  Sender = 'Sender',
  Receiver = 'Receiver',
  SenderAndReceiver = 'SenderAndReceiver',
}

export enum ProfileType {
  HL7 = 'HL7',
  Constrainable = 'Constrainable',
  Implementation = 'Implementation',
}

export interface IMessageProfileIdentifier {
  entityIdentifier: string;
  namespaceId: string;
  universalId: string;
  universalIdType: string;
}
