import { Injectable } from '@angular/core';
import {Types} from "../common/constants/types";
import {NavigationElement} from "./NavigationElement";

@Injectable()
export class DisplayService {



  constructor() { }



  getLabel(value) {

    switch (value) {
      case NavigationElement.metadata  : {
        return "Meta Data";
      }
      case NavigationElement.coConstraint: {
        return "Co-Constraints";

      }
      case NavigationElement.dynamicMapping: {
        return "Dynamic Mapping";

      }
      case NavigationElement.postDef: {
        return "Post Definition";

      }
      case NavigationElement.preDef: {
        return "Pre Definition";

      }
      case NavigationElement.structure: {
        return "Structure";

      }
      case NavigationElement.crossRef: {
        return "Cross Reference";

      }
      case NavigationElement.conformanceStatement: {
        return "Conformance Statements";
      }
      default: {
        break;
      }
    }
  }





  getIcon(value) {


    switch (value) {
      case NavigationElement.metadata  : {
        return "fa fa-edit"
      }
      case NavigationElement.coConstraint: {
        return "fa fa-table";

      }
      case NavigationElement.dynamicMapping: {
        return "fa fa-table";

      }
      case NavigationElement.postDef: {
        return "fa fa-mail-forward";

      }
      case NavigationElement.preDef: {
        return "fa fa-mail-reply";

      }
      case NavigationElement.structure: {
        return "fa fa-list";

      }
      case NavigationElement.crossRef: {
        return "fa fa-list";

      }
      case NavigationElement.conformanceStatement: {
        return "fa fa-table";
      }
      default: {
        break;
      }
    }
  }







  getBadge(type){

    switch (type) {
      case Types.SEGMENT  : {
        return "s"
      }
      case Types.DATATYPE: {
        return "d";

      }
      case Types.VALUESET: {
        return "vs";

      }
      case Types.CONFORMANCEPROFILE: {
        return "cp";

      }
      case Types.PROFILECOMPONENT: {
        return "pc";

      }
      case Types.COMPOSITEPROFILE: {
        return "cp";

      }
      default: {
      return ""
      }
    }
  }
  getBadgStyle(type){
    let style ={
    "min-width": "10px",
    "padding": "3px 7px",
    "color": "#fff",
    "vertical-align": "middle",
   " border-radius": "10px;",
      "background-color":""
    };

    switch (type) {
      case Types.SEGMENT  : {

        style["background-color"]="blue";
        return style;
      }
      case Types.DATATYPE: {
        style["background-color"]="#B8860B"
        return style;
      }
      case Types.VALUESET: {
        style["background-color"]="#4B0082";
        return style;
      }
      case Types.CONFORMANCEPROFILE: {
        style["background-color"]="#778899";
        return style;
      }
      case Types.PROFILECOMPONENT: {
        style["background-color"]="#008B8B";
        return style;
      }
      case Types.COMPOSITEPROFILE: {
        style["background-color"]="#8FBC8F";
        return style;
      }
      default: {
        return style;
      }
    }

  }


  getBadgeClass(type){

    switch (type) {
      case Types.SEGMENT  : {
        return "segment-badge";
      }
      case Types.DATATYPE: {
        return "datatype-badge";
      }
      case Types.VALUESET: {
        return "valueset-badge";
      }
      case Types.CONFORMANCEPROFILE: {
        return "cp-badge";

      }
      case Types.PROFILECOMPONENT: {
        return "pc-badge";
      }
      case Types.COMPOSITEPROFILE: {
        return "cp-badge";
      }
      default: {
        return "";
      }
    }

  }


}
