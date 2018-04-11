/**
 * Created by ena3 on 10/26/17.
 */
import {Injectable}  from "@angular/core";
import {Http} from "@angular/http";
import {canChangeSeconds} from "ngx-bootstrap/timepicker/timepicker-controls.util";


@Injectable()
export  class TocService{

  constructor(private http : Http){
  }

  buildTreeFromIgDocument=function (igdocument) {
    var treeData= [];
    igdocument["content"]["data"]["referenceType"]="root";
    igdocument["content"]["expanded"]=true;
    igdocument["content"]["data"]["sectionTitle"]="Table of Content";
    treeData.push(igdocument["content"]);

    return treeData;

  };



  convertNarratives= function (narratives) {
    var ret = [];
    for(let i=0; i<narratives.length; i++){
      ret.push(this.processSection(narratives[i], ""));
    };
    return ret;

  };

  processSection=function (section, path) {
    var ret={};
    ret["label"]=section.sectionPosition+"."+section.sectionTitle;
    ret["data"]={id: section.id,sectionContent:section.sectionContent, sectionTitle:section.sectionTitle, sectionPosition:section.sectionPosition, path:path+"."+section.sectionPosition, type:section.type};
    if(section.children&&section.children.length>0&&section.type!=='message'){
      ret["children"]=[];
      for(let j =0 ; j<section.children.length; j++){
        ret["children"].push(this.processSection(section.children[j], ret["data"].path));
      }
    }
    return ret;
  };

  processProfile=function (profile) {
    var ret={};
    ret["label"]=profile.sectionPosition+"."+profile.sectionTitle;
    ret["data"]={sectionContent:profile.sectionContent, sectionTitle:profile.sectionTitle, sectionPosition:profile.sectionPosition, type:profile.type};

    ret["children"]=[];
    ret["children"].push( this.processPcLibrary(profile.profileComponentLibrary));
    ret["children"].push( this.processMessages(profile.messages));
    ret["children"].push( this.processSegments(profile.segmentLibrary));
    ret["children"].push( this.processDatatypes(profile.datatypeLibrary));
    ret["children"].push( this.processValueSets(profile.tableLibrary));

    return ret;




  };

  processPcLibrary=function (lib) {
    var ret ={};

    ret["label"]=lib.sectionPosition+"."+lib.sectionTitle;
    ret["data"]={id:lib.id,sectionContent:lib.sectionContent, sectionTitle:"Profile Components", sectionPosition:1};
    ret["children"]=[];

    for(let i=0; i<lib.children.length; i++){
      ret["children"].push(this.processLink(lib.children[i]));
    };
    return ret;
  };


  processMessages=function (lib) {
    var ret =[];
    ret["label"]=lib.sectionPosition+"."+lib.sectionTitle;
    ret["data"]={id:lib.id,sectionContent:lib.sectionContent, sectionTitle:lib.sectionTitle, sectionPosition:2};
    ret["children"]=[];
    for(let i=0; i<lib.children.length; i++){
      ret["children"].push(this.processLink(lib.children[i]));
    };
    return ret;

  };

  processCompositeProfiles=function (lib) {
    var ret ={};

    ret["label"]=lib.sectionPosition+"."+lib.sectionTitle;
    ret["data"]={id:lib.id,sectionContent:lib.sectionContent, sectionTitle:"Profile Components", sectionPosition:1};
    ret["children"]=[];

    for(let i=0; i<lib.children.length; i++){
      ret["children"].push(this.link(lib.children[i]));
    };
    return ret;
  };

  processSegments=function (lib) {
    var ret =[];
    ret["label"]=lib.sectionPosition+"."+lib.sectionTitle;
    ret["data"]={id:lib.id,sectionContent:lib.sectionContent, sectionTitle:lib.sectionTitle, sectionPosition:2};
    ret["children"]=[];
    for(let i=0; i<lib.children.length; i++){
      ret["children"].push(this.processLink(lib.children[i]));
    };
    return ret;
  };
  processDatatypes=function (lib) {
    var ret =[];
    ret["label"]=lib.sectionPosition+"."+lib.sectionTitle;
    ret["data"]={id:lib.id,sectionContent:lib.sectionContent, sectionTitle:lib.sectionTitle, sectionPosition:2};
    ret["children"]=[];
    for(let i=0; i<lib.children.length; i++){
      ret["children"].push(this.processLink(lib.children[i]));
    };
    return ret;
  };

  processValueSets=function (lib) {
    var ret =[];
    ret["label"]=lib.sectionPosition+"."+lib.sectionTitle;
    ret["data"]={id:lib.id,sectionContent:lib.sectionContent, sectionTitle:lib.sectionTitle, sectionPosition:2};
    ret["children"]=[];
    for(let i=0; i<lib.children.length; i++){
      ret["children"].push(this.processLink(lib.children[i]));
    };
    return ret;
  };


  processLink=function (link) {
    var ret =[];

    ret["data"]=link;
    ret["data"].sectionTitle=link.name;

    return ret;
  };










}
