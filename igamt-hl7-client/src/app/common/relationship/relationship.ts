import {Types} from "../constants/types";
/**
 * Created by ena3 on 3/4/19.
 */
export class RelationShip{
  id: string;
  child: ReferenceIndentifier;
  parent: ReferenceIndentifier;
  path: string;

  constructor(child: ReferenceIndentifier, parent: ReferenceIndentifier) {
    this.child = child;
    this.parent = parent;
  }
}

export class ReferenceIndentifier{
   id: string;
   type: Types;

  constructor(id: string, type: Types) {
    this.id = id;
    this.type = type;
  }
}
