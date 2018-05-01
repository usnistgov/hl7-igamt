import {IObject} from './objects-database';

export default class IndexedDbUtils {
  static populateIObject(objectSource, objectTarget): IObject {
    if (objectTarget == null) {
      objectTarget = new IObject();
      objectTarget.id = objectSource.id;
    }
    if (objectSource != null) {
      if (objectSource.metadata != null) {
        objectTarget.metadata = objectSource.metadata;
      }
      if (objectSource.definition != null) {
        objectTarget.definition = objectSource.definition;
      }
      if (objectSource.metadata != null) {
        objectTarget.crossReference = objectSource.crossReference;
      }
    }
    return objectTarget;
  }
}
