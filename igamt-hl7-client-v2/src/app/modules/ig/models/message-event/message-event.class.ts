import {Type} from '../../../shared/constants/type.enum';

export class MessageEventTreeNode {
  constructor( readonly  data: MessageEventTreeData, readonly children: EventTreeNode[]) {}
}
export class MessageEventTreeData {
  type = Type.EVENTS;
  constructor(readonly  id: string, readonly name: string, readonly description: string,
              readonly hl7Version: string) {
  }
}
export class EventTreeData {
  type = Type.EVENT;
  constructor(readonly  id: string, readonly name: string, readonly parentStructId: string,
              readonly hl7Version: string) {
  }
}
export class EventTreeNode {
  constructor( readonly  data: EventTreeData, name: string) {}

}
