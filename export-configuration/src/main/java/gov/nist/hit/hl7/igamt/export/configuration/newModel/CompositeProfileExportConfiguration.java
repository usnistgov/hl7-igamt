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
package gov.nist.hit.hl7.igamt.export.configuration.newModel;

import gov.nist.hit.hl7.igamt.export.configuration.domain.GeneratedFlavorsConfiguration;

/**
 * @author Bouij Youssef
 *
 */
public class CompositeProfileExportConfiguration extends ResourceExportConfiguration {
	
	  private DatatypeExportConfiguration datatypeExportConfiguration;
	  private SegmentExportConfiguration segmentExportConfiguration;
	  private ConformanceProfileExportConfiguration conformamceProfileExportConfiguration;
	  
	  private boolean includeComposition;
	  private boolean flavorExtension;
	
	  private GeneratedFlavorsConfiguration generatedDatatypesFlavorsConfiguration;
	  private GeneratedFlavorsConfiguration generatedSegmentsFlavorsConfiguration;
	  
	  private boolean description2;
	  private boolean entityIdentifier;
	    private boolean namespaceId;
	    private boolean universalId;
	    private boolean universalIdType;


	  

  public CompositeProfileExportConfiguration() {
    super();
  }

public DatatypeExportConfiguration getDatatypeExportConfiguration() {
	return datatypeExportConfiguration;
}

public void setDatatypeExportConfiguration(DatatypeExportConfiguration datatypeExportConfiguration) {
	this.datatypeExportConfiguration = datatypeExportConfiguration;
}

public SegmentExportConfiguration getSegmentExportConfiguration() {
	return segmentExportConfiguration;
}

public void setSegmentExportConfiguration(SegmentExportConfiguration segmentExportConfiguration) {
	this.segmentExportConfiguration = segmentExportConfiguration;
}

public ConformanceProfileExportConfiguration getConformamceProfileExportConfiguration() {
	return conformamceProfileExportConfiguration;
}

public void setConformamceProfileExportConfiguration(
		ConformanceProfileExportConfiguration conformamceProfileExportConfiguration) {
	this.conformamceProfileExportConfiguration = conformamceProfileExportConfiguration;
}

public boolean isIncludeComposition() {
	return includeComposition;
}

public void setIncludeComposition(boolean includeComposition) {
	this.includeComposition = includeComposition;
}

public boolean isFlavorExtension() {
	return flavorExtension;
}

public void setFlavorExtension(boolean flavorExtension) {
	this.flavorExtension = flavorExtension;
}

public GeneratedFlavorsConfiguration getGeneratedDatatypesFlavorsConfiguration() {
	return generatedDatatypesFlavorsConfiguration;
}

public void setGeneratedDatatypesFlavorsConfiguration(
		GeneratedFlavorsConfiguration generatedDatatypesFlavorsConfiguration) {
	this.generatedDatatypesFlavorsConfiguration = generatedDatatypesFlavorsConfiguration;
}

public GeneratedFlavorsConfiguration getGeneratedSegmentsFlavorsConfiguration() {
	return generatedSegmentsFlavorsConfiguration;
}

public void setGeneratedSegmentsFlavorsConfiguration(
		GeneratedFlavorsConfiguration generatedSegmentsFlavorsConfiguration) {
	this.generatedSegmentsFlavorsConfiguration = generatedSegmentsFlavorsConfiguration;
}

public boolean isDescription2() {
	return description2;
}

public void setDescription2(boolean description) {
	this.description2 = description;
}

public boolean isEntityIdentifier() {
	return entityIdentifier;
}

public void setEntityIdentifier(boolean entityIdentifier) {
	this.entityIdentifier = entityIdentifier;
}

public boolean isNamespaceId() {
	return namespaceId;
}

public void setNamespaceId(boolean namespaceId) {
	this.namespaceId = namespaceId;
}

public boolean isUniversalId() {
	return universalId;
}

public void setUniversalId(boolean universalId) {
	this.universalId = universalId;
}

public boolean isUniversalIdType() {
	return universalIdType;
}

public void setUniversalIdType(boolean universalIdType) {
	this.universalIdType = universalIdType;
}




}
