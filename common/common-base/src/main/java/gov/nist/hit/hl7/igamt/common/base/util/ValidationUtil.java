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
package gov.nist.hit.hl7.igamt.common.base.util;



import java.util.regex.Matcher;
import java.util.regex.Pattern;

//import org.apache.commons.lang3.StringUtils;
//import org.apache.commons.lang3.math.NumberUtils;

import gov.nist.hit.hl7.igamt.common.base.domain.SubStructElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;

/**
 * @author Harold Affo
 *
 */
public class ValidationUtil {

  /**
   * 
   * @param usage
   * @param cardMin
   * @throws ValidationException
   */
  public static void validateUsage(Usage usage, int cardMin) throws ValidationException {
    if (usage == null) {
      throw new ValidationException("Usage not found");
    }

    if (usage.equals(Usage.R) && cardMin < 1) {
      throw new ValidationException("Cardinality min must be at least 1 when usage is R");
    }
  }

  /**
   * 
   * @param minLength
   * @param maxLength
   * @throws ValidationException
   */
  public static void validateLength(String minLength, String maxLength) throws ValidationException {
    if (isEmpty(minLength)) {
      throw new ValidationException("Min Length is missing");
    }

    if (isEmpty(maxLength)) {
      throw new ValidationException("Max Length is missing");
    }

    if (SubStructElement.NA.equals(minLength) && !SubStructElement.NA.equals(maxLength)) {
      throw new ValidationException("Max Length must be NA because Min Length is NA ");
    }

    if ((SubStructElement.NA.equals(maxLength) && !SubStructElement.NA.equals(maxLength))) {
      throw new ValidationException("Min Length must be NA because Max Length is NA ");
    }

//    if (!NumberUtils.isNumber(maxLength)
//        && (!"*".equalsIgnoreCase(maxLength) && !SubStructElement.NA.equals(maxLength))) {
//      throw new ValidationException("Max Length has to be * or a numerical value.");
//    }
//
//    if (!NumberUtils.isNumber(minLength)) {
//      if (!SubStructElement.NA.equals(minLength)) {
//        throw new ValidationException("Min Length has to be NA or a numerical value.");
//      }
//    }

    int toBeMaxLenT = Integer.valueOf(maxLength.trim());
    int toBeMinLenT = Integer.valueOf(minLength.trim());

    if (toBeMaxLenT < toBeMinLenT) {
      throw new ValidationException("Max Length cannot be less than Min Length.");
    }

  }


  /**
   * 
   * @param min
   * @param max
   * @param usage
   * @throws ValidationException
   */
  public static void validateCardinality(Integer min, String max, Usage usage)
      throws ValidationException {
    if (min == null) {
      throw new ValidationException("Cardinality Min cannot be empty");
    }
//    if (!NumberUtils.isNumber(max) && !StringUtils.equalsIgnoreCase(max, "*")) {
//      throw new ValidationException("Cardinality Max has to be * or a numerical value.");
//    }

    int toBeMax = 0;
    if ("*".equalsIgnoreCase(max)) {
      toBeMax = Integer.MAX_VALUE;
    } else {
      toBeMax = Integer.valueOf(max);
    }
    if (usage.equals(Usage.X)) {
      if (min != 0 || toBeMax != 0) {
        throw new ValidationException("Cardinality Min and Max must be 0 when Usage is: " + usage);
      }
    }

    if (usage.equals(Usage.R.toString())) {
      if (min < 1) {
        throw new ValidationException(
            "Cardinality Min cannot be less than 1 when Usage is: " + usage);

      }
      if (toBeMax < min) {
        throw new ValidationException("Cardinality Max cannot be less than Cardinality Min.");
      }
    }

    if (usage.equals(Usage.RE.toString())) {
      if (min < 0) {
        throw new ValidationException("Cardinality Min must be 0 when Usage is: " + usage);
      }
      if (min >= 0 && min > toBeMax) {
        throw new ValidationException("Cardinality Max cannot be less than Cardinality Min.");
      }
    }

    if (usage.equals(Usage.O) || usage.equals(Usage.C)) {
      if (min != 0 && !(toBeMax >= 1 && toBeMax != min)) {
        throw new ValidationException("Cardinality Min must be 0 when Usage is: " + usage);
      }
      if (!(min == 0) && (toBeMax >= 1 && toBeMax != min)) {
        throw new ValidationException("Cardinality Min must be 0 when Usage is: " + usage);
      }
    }

  }

  /**
   * 
   * @param confLength
   * @param hl7Version
   * @throws ValidationException
   */
  public static void validateConfLength(String confLength) throws ValidationException {
    if (confLength == null) {
      throw new ValidationException("Conf. Length cannot be empty");
    } else if (!SubStructElement.NA.equals(confLength)) {
      Pattern pattern = Pattern.compile("\\d*[#=]{0,1}");
      Matcher m = pattern.matcher(confLength);
      if (!m.matches()) {
        throw new ValidationException("Conf. Length is invalid. Expected format is " + pattern);
      }
    }
  }



  /**
   * 
   * @param value
   * @return
   */
  private static boolean isEmpty(String value) {
    return value == null || "'".equals(value);
  }


}
