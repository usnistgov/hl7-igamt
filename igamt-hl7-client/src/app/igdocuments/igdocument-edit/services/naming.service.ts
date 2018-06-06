import {Injectable}  from "@angular/core";
import {SegmentsIndexedDbService} from "../../../service/indexed-db/segments/segments-indexed-db.service";
import {DatatypesIndexedDbService} from "../../../service/indexed-db/datatypes/datatypes-indexed-db.service";
import {ValuesetsIndexedDbService} from "../../../service/indexed-db/valuesets/valuesets-indexed-db.service";
import {SectionsIndexedDbService} from "../../../service/indexed-db/sections/sections-indexed-db.service";
import * as _ from 'lodash';
import {ConformanceProfilesIndexedDbService} from "../../../service/indexed-db/conformance-profiles/conformance-profiles-indexed-db.service";
@Injectable()
export  class NamingService {
  constructor(private segmentsIndexedDbService:SegmentsIndexedDbService,datatypesIndexedDbService:DatatypesIndexedDbService,

              private valueSetsIndexedDbService:ValuesetsIndexedDbService,
              private sectionsIndexedDbService:SectionsIndexedDbService,
              private conformanceProfilesIndexedDbService:ConformanceProfilesIndexedDbService) {
  }

  updateIgTocNames(igToc:any[]){

    this.updateNarratives(igToc);
    this.updateProfile(igToc);
  }

  findNodeByType(children, type){
    return _.find(children, function(node) { return type == node.data.type;});

  }
  updateNarratives(igToc:any[]){
  }
  updateProfile(igToc:any[]){
    var profile = this.findNodeByType(igToc, "PROFILE");
    _.forEach(profile.children, function(child) {
      if(child.data.type){
        if(child.data.type=='SEGMENTREGISTRY'){

        }
      }




    });

  }


}
