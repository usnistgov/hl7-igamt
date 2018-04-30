import {IObject} from './objects-database';

export default class IndexedDbUtils {
  static populateIObject(objectSource, objectTarget): IObject {
    if (objectTarget == null) {
      objectTarget = new IObject();
      objectTarget.id = objectSource.id;
    }
    if (objectTarget.metadata != null) {
      objectTarget.metadata = objectSource.metadata;
    }
    if (objectTarget.definition != null) {
      objectTarget.definition = objectSource.definition;
    }
    if (objectTarget.metadata != null) {
      objectTarget.crossReference = objectTarget.crossReference;
    }
    return objectTarget;
  }
}
