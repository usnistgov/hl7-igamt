import Dexie from 'dexie';

interface IObject {
  id?: string;
  object?: object;
}

/*
export interface IDatatype {
  id?: string;
  datatype?: object;
}
export interface IValueSet {
  id?: string;
  valueSet?: object;
}
export interface ISegment {
  id?: string;
  segment?: object;
}
export interface ISection {
  id?: string;
  section?: object;
}
export interface IProfileComponent {
  id?: string;
  profileComponent?: object;
}
export interface IProfile {
  id?: string;
  profile?: object;
}
*/

export class ObjectsDatabase extends Dexie {
  datatypes: Dexie.Table<IObject, number>;
  valueSets: Dexie.Table<IObject, number>;
  segments: Dexie.Table<IObject, number>;
  sections: Dexie.Table<IObject, number>;
  profileComponents: Dexie.Table<IObject, number>;
  profiles: Dexie.Table<IObject, number>;

  constructor(name) {
    super(name);
    this.version(1).stores({
      datatypes: '++id,object',
      segments: '++id,object',
      sections: '++id,object',
      profileComponents: '++id,object',
      profiles: '++id,object',
      valueSets: '++id,object'
    });
  }
}
