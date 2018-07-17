/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.legacy.service.impl.exportFonts;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportFont;
import gov.nist.hit.hl7.igamt.export.configuration.repository.ExportFontRepository;
import gov.nist.hit.hl7.igamt.legacy.service.ConversionService;


/**
 *
 * @author Maxence Lefort on Mar 5, 2018.
 */
public class ExportFontConversionServiceImpl implements ConversionService {

  @Autowired
  private gov.nist.hit.hl7.igamt.legacy.repository.ExportFontRepository oldExportFontRepository =
      (gov.nist.hit.hl7.igamt.legacy.repository.ExportFontRepository) legacyContext
          .getBean("exportFontRepository");

  @Autowired
  private ExportFontRepository convertedExportFontService = context.getBean(ExportFontRepository.class);

  @Override
  public void convert() {
    List<gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ExportFont> oldExportFonts = oldExportFontRepository.findAll();
    for(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ExportFont oldExportFont : oldExportFonts) {
      ExportFont exportFont = new ExportFont(oldExportFont.getName(), oldExportFont.getValue());
      convertedExportFontService.save(exportFont);
    }
  }

}
