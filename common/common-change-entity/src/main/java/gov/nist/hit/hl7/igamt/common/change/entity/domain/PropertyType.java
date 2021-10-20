/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 */
package gov.nist.hit.hl7.igamt.common.change.entity.domain;

/**
 * @author jungyubw
 *
 */
public enum PropertyType {
  //METDATA
  EXT, AUTHORNOTES, USAGENOTES, IDENTIFIER, BINDINGIDENTIFIER, DESCRIPTION, NAME, AUTHORS, PROFILETYPE, ROLE, PROFILEIDENTIFIER, ORGANISATION, CHANGEREASON,
  //PRETEXT
  PREDEF,
  DISPLAYNAME,
  
  //POSTTEXT
  POSTDEF,
  
  //DYNAMICMAPPING
  MAPPINGITEM,
  
  //CONFORMANCESTATEMENT
  STATEMENT, PATTERN,
  
  //COCONSTRAINT
  COCONSTRAINT,
  COCONSTRAINTBINDINGS,

  //COCONSTRAINT (FOR VERIFICATION ERRORS)
  COCONSTRAINTBINDING_CONTEXT,
  COCONSTRAINTBINDING_SEGMENT,
  COCONSTRAINTBINDING_CONDITION,
  COCONSTRAINTBINDING_TABLE,
  COCONSTRAINTBINDING_HEADER,
  COCONSTRAINTBINDING_GROUP,
  COCONSTRAINTBINDING_ROW,
  COCONSTRAINTBINDING_CELL,



  //VALUESET
  CODES,
  CODESYSTEM,
  EXTENSIBILITY,
  CONTENTDEFINITION,
  STABILITY,
  URL,
  INTENSIONALCOMMENT,
  
  //STRUCTURE
  STRUCTSEGMENT,
  FIELD,
  USAGE, TRUEUSAGE, FALSEUSAGE, CARDINALITYMIN, CARDINALITYMAX, LENGTHMIN, LENGTHMAX, CONFLENGTH, LENGTHTYPE, DATATYPE, VALUESET, SINGLECODE, CONSTANTVALUE, PREDICATE, DEFINITIONTEXT, COMMENT, SEGMENTREF, DTMSTRUC, SHORTDESCRIPTION, VALUE, 
  DYNAMICMAPPINGITEM, FLAVORSEXTENSION,
  DYNAMICMAPPING
  
}
