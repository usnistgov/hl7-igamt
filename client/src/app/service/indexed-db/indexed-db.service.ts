import {Injectable} from '@angular/core';

import { ObjectsDatabase } from './objects-database';
import { DatatypesService } from '../datatypes/datatypes.service';
import { ValueSetsService } from '../valueSets/valueSets.service';
import {SegmentsService} from "../segments/segments.service";
import {ProfileComponentsService} from "../profilecomponents/profilecomponents.service";

@Injectable()
export class IndexedDbService {

  objectsDatabase;
  changedObjectsDatabase;
  constructor(private datatypesService: DatatypesService, private valueSetsService: ValueSetsService, private segmentsService: SegmentsService, private profileComponentsService: ProfileComponentsService) {
    this.objectsDatabase = new ObjectsDatabase('ObjectsDatabase');
    this.changedObjectsDatabase = new ObjectsDatabase('ChangedObjectsDatabase');
  }
  public init(ig) {
    this.objectsDatabase.transaction('rw', this.objectsDatabase.datatypes, async() => {
      this.objectsDatabase.datatypes.clear().then(this.injectDatatypes(ig.profile.datatypeLibrary.id));
    });
    this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.datatypes, async() => {
       this.changedObjectsDatabase.datatypes.clear();
    });
    // valueSets
    this.objectsDatabase.transaction('rw', this.objectsDatabase.valueSets, async() => {
      this.objectsDatabase.valueSets.clear().then(this.injectValueSets(ig.profile.tableLibrary.id));
    });
    this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.valueSets, async() => {
       this.changedObjectsDatabase.valueSets.clear();
    });
    // segments
    this.objectsDatabase.transaction('rw', this.objectsDatabase.segments, async() => {
      this.objectsDatabase.segments.clear().then(this.injectSegments(ig.profile.segmentLibrary.id));
    });
    this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.segments, async() => {
       this.changedObjectsDatabase.segments.clear();
    });
    // sections
    this.objectsDatabase.transaction('rw', this.objectsDatabase.sections, async() => {
     // this.objectsDatabase.sections.clear().then(this.injectDatatypes(igDocumentId));
    });
    this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.sections, async() => {
      // this.changedObjectsDatabase.sections.clear();
    });
    // profileComponents
    this.objectsDatabase.transaction('rw', this.objectsDatabase.profileComponents, async() => {
      this.objectsDatabase.profileComponents.clear().then(this.injectProfileComponents(ig.profile.profileComponentLibrary.id));
    });
    this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.profileComponents, async() => {
      // this.changedObjectsDatabase.profileComponents.clear();
    });
    // profiles
    this.objectsDatabase.transaction('rw', this.objectsDatabase.profiles, async() => {
      // this.objectsDatabase.profiles.clear().then(this.injectDatatypes(igDocumentId));
    });
    this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.profiles, async() => {
      // this.changedObjectsDatabase.profiles.clear();
    });
  }

  /*
  .filter(function (fullDatatype) {
        const metadataDatatype = {
          'label': fullDatatype.label,
          'hl7Version': fullDatatype.hl7Version
        }
        return metadataDatatype;
      });
   */

  public getDatatype (id, callback) {
    let datatype;
    this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.datatypes, async() => {
      datatype = await this.changedObjectsDatabase.datatypes.get(id);
      if (datatype != null) {
        callback(datatype.object);
      } else {
        this.objectsDatabase.transaction('r', this.objectsDatabase.datatypes, async() => {
          datatype = await this.objectsDatabase.datatypes.get(id);
          callback(datatype.object);
        });
      }
    });
  }
  public getValueSet (id, callback) {
    let valueSet;
    this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.valueSets, async() => {
      valueSet = await this.changedObjectsDatabase.valueSets.get(id);
      if (valueSet != null) {
        callback(valueSet.object);
      } else {
        this.objectsDatabase.transaction('r', this.objectsDatabase.valueSets, async() => {
          valueSet = await this.objectsDatabase.valueSets.get(id);
          callback(valueSet.object);
        });
      }
    });
  }

  public getSegment (id, callback) {
    let segment;
    this.changedObjectsDatabase.transaction('r', this.changedObjectsDatabase.segments, async() => {
      segment = await this.changedObjectsDatabase.segments.get(id);
      if (segment != null) {
        callback(segment.object);
      } else {
        this.objectsDatabase.transaction('r', this.objectsDatabase.segments, async() => {
          segment = await this.objectsDatabase.segments.get(id);
          callback(segment.object);
        });
      }
    });
  }

  public getDatatypeMetadata (id, callback) {
    this.getDatatype(id, function(datatype){
      const metadataDatatype = {
        'id': datatype.id,
        'name': datatype.name,
        'ext': datatype.ext,
        'label': datatype.label,
        'scope': datatype.scope,
        'publicationVersion': datatype.publicationVersion,
        'hl7Version': datatype.hl7Version,
        'hl7Versions': datatype.hl7Versions,
        'numberOfComponents': datatype.components.length,
        'type': datatype.type
      }
       callback(metadataDatatype);
    });
  }
  public getSegmentMetadata (id, callback) {
    this.getSegment(id, function(segment){
      const metadataSegment = {
        'id': segment.id,
        'name': segment.name,
        'scope': segment.scope,
        'hl7Version': segment.hl7Version,
        'numberOfFields': segment.fields.length,
        'type': segment.type
      }
       callback(metadataSegment);
    });
  }
  public getValueSetMetadata (id, callback) {
    this.getValueSet(id, function(valueSet){
      const metadataValueSet = {
        'id': valueSet.id,
        'bindingIdentifier': valueSet.bindingIdentifier,
        'scope': valueSet.scope,
        'hl7Version': valueSet.hl7Version,
        'type': valueSet.type
      }
       callback(metadataValueSet);
    });
  }

  private injectDatatypes(libId) {
    this.datatypesService.getDatatypes(libId, this.populateDatatypes.bind(this));
  }
  private injectValueSets(libID) {
    this.valueSetsService.getValueSets(libID, this.populateValueSets.bind(this));
  }

  private injectSegments(libId) {
    this.segmentsService.getSegments(libId, this.populateSegments.bind(this));
  }
  private injectProfileComponents(libID) {
    this.profileComponentsService.getProfileComponents(libID, this.populateProfileComponents.bind(this));
  }

  private populateDatatypes (datatypes) {
    datatypes.forEach(datatype => {
      this.objectsDatabase.transaction('rw', this.objectsDatabase.datatypes, async() => {
        await this.objectsDatabase.datatypes.put({
          'id': datatype.id,
          'object': datatype
        });
      });
    });
  };
  private populateValueSets (valueSets) {
    valueSets.forEach(valueSet => {
      this.objectsDatabase.transaction('rw', this.objectsDatabase.valueSets, async() => {
        await this.objectsDatabase.valueSets.put({
          'id': valueSet.id,
          'object': valueSet
        });
      });
    });
  };

  private populateSegments (segments) {
    segments.forEach(segment => {
      this.objectsDatabase.transaction('rw', this.objectsDatabase.segments, async() => {
        await this.objectsDatabase.segments.put({
          'id': segment.id,
          'object': segment
        });
      });
    });
  };
  private populateProfileComponents (profileComponents) {
    profileComponents.forEach(pc => {
      this.objectsDatabase.transaction('rw', this.objectsDatabase.profileComponents, async() => {
        await this.objectsDatabase.profileComponents.put({
          'id': pc.id,
          'object': pc
        });
      });
    });
  };
  public saveDatatype(datatype) {
    this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.datatypes, async() => {
      await this.changedObjectsDatabase.datatypes.put({
        'id': datatype.id,
        'object': datatype
      });
    });
  }
  public saveSegment(segment) {
    console.log(segment);
    this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.segments, async() => {
      await this.changedObjectsDatabase.segments.put({
        'id': segment.id,
        'object': segment
      });
    });
  }

  /*public saveChangedDatatypes() {
    this.changedObjectsDatabase.transaction('rw', this.changedObjectsDatabase.datatypes, async () => {
      const changedDatatypes = await this.changedObjectsDatabase.datatypes.toArray();
      this.datatypesService.saveDatatypes(changedDatatypes);
    });
  }*/
}
