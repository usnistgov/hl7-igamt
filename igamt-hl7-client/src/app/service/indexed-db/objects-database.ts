import Dexie from 'dexie';

export class IObject {
  id?: string;
  metadata?: any;
  structure?: any;
  preDef?: any;
  postDef?: any;
  crossReference?: any;
  conformanceStatements?: any;
  changeType?:ChangeType
}

export class dndObject{
  from:any;
  to:any;
  position:any;

}
export class Section {
  id?: string;
  dnd:dndObject;
  section:any;

}

export enum ChangeType{
  UPDATED="UPDATED",
  DELETED="DELETED",
  ADDED="ADDED"
}



export class ObjectsDatabase extends Dexie {

  constructor(name) {
    super(name);
    this.version(1).stores({
      datatypes: '&id',
      segments: '&id',
      sections: '&id',
      profileComponents: '&id',
      conformanceProfiles: '&id',
      compositeProfiles: '&id',
      valuesets: '&id'
    });
  }
}
