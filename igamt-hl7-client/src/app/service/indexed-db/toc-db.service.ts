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
              public valuesetsTocService: ValuesetsTocService) {}

  public bulkAddToc(valuesets, datatypes, segments, conformanceProfiles, profileComponents, compositeProfiles): Promise<{}> {

    const promises = [];
    promises.push(this.datatypesTocService.bulkAdd(datatypes));
    promises.push(this.segmentsTocService.bulkAdd(segments));
    promises.push(this.conformanceProfilesTocService.bulkAdd(conformanceProfiles));
    promises.push(this.profileComponentsTocService.bulkAdd(profileComponents));
    promises.push(this.compositeProfilesTocService.bulkAdd(compositeProfiles));
    promises.push(this.valuesetsTocService.bulkAdd(valuesets));

    console.log(promises);
    return Promise.all(promises);
  }

}
