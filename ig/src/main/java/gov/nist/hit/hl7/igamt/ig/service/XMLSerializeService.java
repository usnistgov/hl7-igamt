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
package gov.nist.hit.hl7.igamt.ig.service;

import java.io.IOException;
import java.util.zip.ZipOutputStream;

import gov.nist.hit.hl7.igamt.ig.domain.datamodel.IgDataModel;
import gov.nist.hit.hl7.igamt.service.impl.exception.CoConstraintXMLSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.ProfileSerializationException;
import gov.nist.hit.hl7.igamt.service.impl.exception.TableSerializationException;
import nu.xom.Document;
import nu.xom.Element;

/**
 * @author jungyubw
 *
 */
public interface XMLSerializeService {

  Document serializeProfileToDoc(IgDataModel igModel) throws ProfileSerializationException ;

  Element serializeValueSetXML(IgDataModel igModel) throws TableSerializationException ;

  Element serializeCoConstraintXML(IgDataModel igModel) throws TableSerializationException, CoConstraintXMLSerializationException;

  Element serializeConstraintsXML(IgDataModel igModel);
  
  Element serializeSlicingXML(IgDataModel igModel);

  void generateIS(ZipOutputStream out, String xmlStr, String fileName) throws IOException;

  void normalizeIgModel(IgDataModel igModel, String[] conformanceProfileIds) throws CloneNotSupportedException, ClassNotFoundException, IOException;
}
