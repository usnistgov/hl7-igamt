import Dexie from 'dexie';

export class IgDocumentInfo {
  id?: string;
  toc?:any[];
  metadata:any;

  constructor(id) {
    this.id = id;
  }
}

export class DatatypeLibraryInfo {
  id?: string;
  toc?:any[];
  metadata:any;

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

export class DatatypeLibraryInfoDatabase extends Dexie {

  constructor() {
    super('DatatypeLibraryInfoDatabase');
    this.version(1).stores({
      datatypeLibrary: '&id'
    });
  }
}
