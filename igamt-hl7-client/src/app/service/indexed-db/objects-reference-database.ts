import Dexie from 'dexie';

interface IObjectReference {
  id?: string;
}

export class ObjectsReferenceDatabase extends Dexie {
  datatypes: Dexie.Table<IObjectReference, number>;
  valueSets: Dexie.Table<IObjectReference, number>;
  segments: Dexie.Table<IObjectReference, number>;
  sections: Dexie.Table<IObjectReference, number>;
  profileComponents: Dexie.Table<IObjectReference, number>;
  conformanceProfiles: Dexie.Table<IObjectReference, number>;
  compositeProfiles: Dexie.Table<IObjectReference, number>;

  constructor(name) {
    super(name);
    this.version(1).stores({
      datatypes: '++id',
      segments: '++id',
      sections: '++id',
      profileComponents: '++id',
      conformanceProfiles: '++id',
      compositeProfiles: '++id',
      valueSets: '++id'
    });
  }
}
