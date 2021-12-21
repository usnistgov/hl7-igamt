import { Type } from '../constants/type.enum';
import { IResourceBinding } from './binding.interface';
import { ICoConstraintBindingContext } from './co-constraint.interface';
import { IComment } from './comment.interface';
import { IRef } from './ref.interface';
import { IResource } from './resource.interface';
import { IChangeReason } from './save-change';
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

export interface IHL7MessageProfile extends IResource {
  identifier: string;
  messageType: string;
  event: string;
  structID: string;
  profileType: ProfileType;
  role: Role;
  preCoordinatedMessageIdentifier: IMessageProfileIdentifier;
  displayName: string;
  children: IMsgStructElement[];
  binding?: IResourceBinding;
}

export interface IConformanceProfile extends IHL7MessageProfile {
  coConstraintsBindings: ICoConstraintBindingContext[];
  coConstraintBindingsChangeLog: IChangeReason[];
}

export interface IMessageStructure extends IHL7MessageProfile {
  custom: boolean;
  participants: string[];
  events: IEvent[];
}

export interface IEvent {
  id: string;
  name: string;
  parentStructId: string;
  description: string;
  type: Type;
  hl7Version: string;
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

export class IMessageProfileIdentifier {
  entityIdentifier?: string;
  namespaceId?: string;
  universalId?: string;
  universalIdType?: string;
}
