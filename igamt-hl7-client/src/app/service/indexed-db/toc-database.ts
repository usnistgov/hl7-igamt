/**
 * Created by ena3 on 5/7/18.
 */
import Dexie from 'dexie';

export class TocNode {
  id?: string;
  treeNode?: any;
}

export class TocDatabase extends Dexie {

  constructor(name) {
    super(name);
    this.version(1).stores({
      datatypes: '&id',
      segments: '&id',
      valuesets: '&id',
      conformanceProfiles: '&id',
      compositeProfiles: '&id',
      profileComponents: '&id',

    });
  }
}
