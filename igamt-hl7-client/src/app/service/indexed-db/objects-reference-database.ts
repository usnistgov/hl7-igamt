import Dexie from 'dexie';

interface IObjectReference {
  id?: string;
}

export class ObjectsReferenceDatabase extends Dexie {

  constructor(name) {
    super(name);
    this.version(1).stores({
      datatypes: '&id',
      segments: '&id',
      sections: '&id',
      profileComponents: '&id',
      conformanceProfiles: '&id',
      compositeProfiles: '&id',
      valueSets: '&id'
    });
  }
}
