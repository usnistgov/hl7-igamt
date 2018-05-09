import Dexie from 'dexie';

export class Node {
  id?: string;
  structure?: object;
}

export class NodeDatabase extends Dexie {

  constructor(name) {
    super(name);
    this.version(1).stores({
      datatypes: '&id',
      segments: '&id'
    });
  }
}
