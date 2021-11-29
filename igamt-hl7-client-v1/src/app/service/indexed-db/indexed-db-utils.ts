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
      if (objectSource.crossReference != null) {
        objectTarget.crossReference = objectSource.crossReference;
      }
      if (objectSource.structure != null) {
        objectTarget.structure = objectSource.structure;
      }
      if (objectSource.preDef != null) {
        objectTarget.preDef = objectSource.preDef;
      }
      if (objectSource.postDef != null) {
        objectTarget.postDef = objectSource.postDef;
      }
      if (objectSource.conformanceStatements != null) {
        objectTarget.conformanceStatements = objectSource.conformanceStatements;
      }
    }
    return objectTarget;
  }
}
