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
  datatypes: Dexie.Table<IObject, number>;
  valueSets: Dexie.Table<IObject, number>;
  segments: Dexie.Table<IObject, number>;
  sections: Dexie.Table<ISection, number>;
  profileComponents: Dexie.Table<IObject, number>;
  conformanceProfiles: Dexie.Table<IObject, number>;
  compositeProfiles: Dexie.Table<IObject, number>;

  constructor(name) {
    super(name);
    this.version(1).stores({
      datatypes: '++id,object,object,object',
      segments: '++id,object,object,object',
      sections: '++id,object',
      profileComponents: '++id,object,object,object',
      conformanceProfiles: '++id,object,object,object',
      compositeProfiles: '++id,object,object,object',
      valueSets: '++id,object,object,object'
    });
  }
}
