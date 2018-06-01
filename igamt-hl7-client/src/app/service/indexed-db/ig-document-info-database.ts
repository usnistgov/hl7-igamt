import Dexie from 'dexie';

export class IgDocumentInfo {
  id?: string;
  constructor(id) {
    this.id = id;
  }
}

export class IgDocumentInfoDatabase extends Dexie {

  constructor() {
    super('IgDocumentInfoDatabase');
    this.version(1).stores({
      igDocument: '&id'
    });
  }
}
