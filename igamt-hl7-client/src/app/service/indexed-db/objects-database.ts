import Dexie from 'dexie';

export class IObject {
  id?: string;
  metadata?: object;
  definition?: object;
  crossReference?: object;
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
