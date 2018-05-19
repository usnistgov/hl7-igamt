import Dexie from 'dexie';

export class IObject {
  id?: string;
  metadata?: object;
  structure?: object;
  preDef?: object;
  postDef?: object;
  crossReference?: object;
  conformanceStatements?: object;
}

interface ISection {
  id?: string;
  content?: object;
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
