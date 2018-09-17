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
package gov.nist.hit.hl7.igamt.serialization.util;

import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.select.Elements;

import com.mongodb.gridfs.GridFSDBFile;

/**
 *
 * @author Maxence Lefort on May 14, 2018.
 */
public class FroalaSerializationUtil {

  public static  String cleanFroalaInput(String input) {
    input = input.replace("<br>", "<br />");
    if (input.contains("<pre>")) {
      input = input.replace("\n", "<br />");
    }
    input = input.replace("<p style=\"\"><br></p>", "");
    input = input.replace("<p ", "<div ");
    input = input.replace("<p>", "<div>");
    input = input.replace("</p>", "</div>");
    // input = input.replace("&reg;","&amp;reg;");
    input = input.replace("&lsquo;", "&#39;");
    input = input.replaceAll("[^\\p{Print}]", "?");
    Document doc = Jsoup.parse(input);
    Elements elements1 = doc.select("h1");
    elements1.tagName("p").attr("style",
        "display: block;font-size: 16.0pt;margin-left: 0;margin-right: 0;font-weight: bold;");
    // elements1.after("<hr />");
    Elements elements2 = doc.select("h2");
    elements2.tagName("p").attr("style",
        "display: block;font-size: 14.0pt;margin-left: 0;margin-right: 0;font-weight: bold;");
    Elements elements3 = doc.select("h3");
    elements3.tagName("p").attr("style",
        "display: block;font-size: 12.0pt;margin-left: 0;margin-right: 0;font-weight: bold;");
    Elements elements4 = doc.select("h4");
    elements4.tagName("p").attr("style",
        "display: block;font-size: 10.0pt;margin-left: 0;margin-right: 0;font-weight: bold;");
    Elements elementsPre = doc.select("pre");
    elementsPre.tagName("p").attr("class", "codeParagraph");
    for (org.jsoup.nodes.Element elementImg : doc.select("img")) {
      try {
        if (elementImg.attr("src") != null && !"".equals(elementImg.attr("src"))) {
          InputStream imgis = null;
          String ext = null;
          byte[] bytes = null;
          if (elementImg.attr("src").indexOf("name=") != -1) {
            String filename =
                elementImg.attr("src").substring(elementImg.attr("src").indexOf("name=") + 5);
            ext = FilenameUtils.getExtension(filename);
            // TODO add images
            // GridFSDBFile dbFile = fileStorageService.findOneByFilename(filename);
            // if (dbFile != null) {
            // imgis = dbFile.getInputStream();
            // bytes = IOUtils.toByteArray(imgis);
            // }
          } else {
            String filename = elementImg.attr("src");
            ext = FilenameUtils.getExtension(filename);
            URL url = new URL(filename);
            bytes = IOUtils.toByteArray(url);
          }
          if (bytes != null && bytes.length > 0) {
            String imgEnc = Base64.getEncoder().encodeToString(bytes);
            String texEncImg = "data:image/" + ext + ";base64," + imgEnc;
            elementImg.attr("src", texEncImg);
          }
        }
        if (elementImg.attr("alt") == null || elementImg.attr("alt").isEmpty()) {
          elementImg.attr("alt", ".");
        }
      } catch (RuntimeException e) {
        e.printStackTrace(); // If error, we leave the original document
        // as is.
      } catch (Exception e) {
        e.printStackTrace(); // If error, we leave the original document
        // as is.
      }
    }
    for (Element elementTbl : doc.select("table")) {
      if (elementTbl.attr("summary") == null || elementTbl.attr("summary").isEmpty()) {
        elementTbl.attr("summary", ".");
      }
    }
    for (Element element : doc.select("td")) {
      removeEndingBrTag(element);
    }
    for (Element element : doc.select("th")) {
      removeEndingBrTag(element);
    }
    for (org.jsoup.nodes.Element element : doc.select("div")) {
      element.html("<br/>" + element.html());
      removeDoubleBrTag(element);
    }
    Node bodyNode = doc.childNode(0).childNode(1);
    if (bodyNode.childNodeSize() > 0) {
      Node lastNode = bodyNode.childNode(bodyNode.childNodeSize() - 1);
      if (lastNode instanceof Element) {
        removeEndingBrTag((Element) lastNode);
      }
    }

    // Renaming strong to work as html4
    doc.select("strong").tagName("b");
    String html = doc.body().html();
    html = html.replace("<br>", "<br />");
    return "<div class=\"fr-view\">" + html + "</div>";
  }

  private static void removeEndingBrTag(Element element) {
    if (element.childNodeSize() > 0) {
      boolean isLastElementNotBr = false;
      int i = 1;
      while (!isLastElementNotBr && element.childNodeSize() >= i) {
        Node node = element.childNodes().get(element.childNodeSize() - i);
        i++;
        if (node instanceof Element) {
          Element childElement = (Element) node;
          if (childElement.tagName().equals("br")) {
            childElement.remove();
          } else {
            isLastElementNotBr = true;
          }
        } else {
          isLastElementNotBr = true;
        }
      }
    }
  }

  private static void removeDoubleBrTag(Element element) {
    List<Element> toBeRemoved = new ArrayList<>();
    Element previousElement = null;
    for (Node node : element.childNodes()) {
      if (node instanceof Element) {
        if (previousElement != null) {
          if (previousElement.tag().getName().equals("br")
              && ((Element) node).tag().getName().equals("br")) {
            toBeRemoved.add((Element) node);
          }
        }
        previousElement = (Element) node;
      } else {
        previousElement = null;
      }
    }
    for (Element elementToBeRemoved : toBeRemoved) {
      elementToBeRemoved.remove();
    }
  }

}
