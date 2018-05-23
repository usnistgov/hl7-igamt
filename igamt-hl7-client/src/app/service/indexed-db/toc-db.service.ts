import {Injectable} from '@angular/core';
import {CompositeProfilesTocService} from './composite-profiles/composite-profiles-toc.service';
import {ConformanceProfilesTocService} from './conformance-profiles/conformance-profiles-toc.service';
import {DatatypesTocService} from './datatypes/datatypes-toc.service';
import {ProfileComponentsTocService} from './profile-components/profile-components-toc.service';
import {SegmentsTocService} from './segments/segments-toc.service';
import {ValuesetsTocService} from './valuesets/valuesets-toc.service';

@Injectable()
export class TocDbService {

  constructor(public compositeProfilesTocService: CompositeProfilesTocService,
              public conformanceProfilesTocService: ConformanceProfilesTocService,
              public datatypesTocService: DatatypesTocService,
              public profileComponentsTocService: ProfileComponentsTocService,
              public segmentsTocService: SegmentsTocService,
              public valuesetsTocService: ValuesetsTocService) {
  }

  public bulkAddToc(valuesets, datatypes, segments, conformanceProfiles, profileComponents, compositeProfiles): Promise<{}> {
    const promises = [];
    if (datatypes != null) {
      promises.push(this.datatypesTocService.bulkAdd(datatypes));
    }
    if (segments != null) {
      promises.push(this.segmentsTocService.bulkAdd(segments));
    }
    if (conformanceProfiles != null) {
      promises.push(this.conformanceProfilesTocService.bulkAdd(conformanceProfiles));
    }
    if (profileComponents != null) {
      promises.push(this.profileComponentsTocService.bulkAdd(profileComponents));
    }
    if (compositeProfiles != null) {
      promises.push(this.compositeProfilesTocService.bulkAdd(compositeProfiles));
    }
    if (valuesets != null) {
      promises.push(this.valuesetsTocService.bulkAdd(valuesets));
    }
    return Promise.all(promises);
  }

  public bulkAddTocNewElements(valuesets, datatypes, segments, conformanceProfiles, profileComponents, compositeProfiles): Promise<{}> {
    const promises = [];
    if (datatypes != null) {
      promises.push(this.datatypesTocService.bulkAddNewDatatypes(datatypes));
    }
    if (segments != null) {
      promises.push(this.segmentsTocService.bulkAddNewSegments(segments));
    }
    if (conformanceProfiles != null) {
      promises.push(this.conformanceProfilesTocService.bulkAddNewConformanceProfiles(conformanceProfiles));
    }
    if (profileComponents != null) {
      promises.push(this.profileComponentsTocService.bulkAddNewProfileComponents(profileComponents));
    }
    if (compositeProfiles != null) {
      promises.push(this.compositeProfilesTocService.bulkAddNewCompositeProfiles(compositeProfiles));
    }
    if (valuesets != null) {
      promises.push(this.valuesetsTocService.bulkAddNewValuesets(valuesets));
    }
    return Promise.all(promises);
  }
}
