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
package gov.nist.hit.hl7.igamt.export.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Properties;

import org.w3c.tidy.Tidy;

/**
 *
 * @author Maxence Lefort on May 8, 2018.
 */
public class HtmlUtil {

  public static InputStream cleanHtml(InputStream html) {
    Properties oProps = new Properties();
    oProps.setProperty("new-blocklevel-tags", "figcaption");
    oProps.setProperty("char-encoding", "utf8");
    Tidy tidy = new Tidy();
    tidy.setConfigurationFromProps(oProps);
    tidy.setWraplen(Integer.MAX_VALUE);
    tidy.setDropEmptyParas(true);
    tidy.setXHTML(true);
    tidy.setShowWarnings(false); // to hide errors
    tidy.setQuiet(false); // to hide warning
    tidy.setMakeClean(true);
    tidy.setTidyMark(false);
    // tidy.setBreakBeforeBR(true);
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    tidy.parseDOM(html, outputStream);
    return new ByteArrayInputStream(outputStream.toByteArray());
  }

}
