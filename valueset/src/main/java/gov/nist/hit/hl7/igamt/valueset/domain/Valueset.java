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
package gov.nist.hit.hl7.igamt.valueset.domain;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.mongodb.core.mapping.Document;

import gov.nist.hit.hl7.igamt.common.base.domain.CodeType;
import gov.nist.hit.hl7.igamt.common.base.domain.ContentDefinition;
import gov.nist.hit.hl7.igamt.common.base.domain.Extensibility;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.SourceType;
import gov.nist.hit.hl7.igamt.common.base.domain.Stability;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.ChangeReason;
import gov.nist.hit.hl7.igamt.common.change.entity.domain.PropertyType;

/**
 * @author jungyubw
 *
 */
@Document(collection = "valueset")
public class Valueset extends Resource {
	
	private String bindingIdentifier;
	private String oid;
	private String intensionalComment;
	private String url;
	private Stability stability = Stability.Undefined;
	private Extensibility extensibility = Extensibility.Undefined;
	private ContentDefinition contentDefinition = ContentDefinition.Undefined;
	private SourceType sourceType = SourceType.INTERNAL;
	private int numberOfCodes;
	private String hl7Type; 
	@org.springframework.data.annotation.Transient
	private boolean includeCodes;
	private boolean isFlavor;
	private List<ChangeReason> changeLogs;
	private Set<String> codeSystems = new HashSet<String>();
	private Set<Code> codes = new HashSet<Code>();
	
	private CodeType codeType;
	private Date snapshotDate;
	
	private CodeSetReference codeSetReference;
	
	@org.springframework.data.annotation.Transient
	private CodeSetLinkInfo codeSetLink;
	

	public boolean isIncludeCodes() {
		return includeCodes;
	}

	public void setIncludeCodes(boolean includeCodes) {
		this.includeCodes = includeCodes;
	}

	public int getNumberOfCodes() {
		return numberOfCodes;
	}
	

	public Valueset() {
		super();
		super.setType(Type.VALUESET);
	}

	public String getBindingIdentifier() {
		return bindingIdentifier;
	}

	public void setBindingIdentifier(String bindingIdentifier) {
		this.bindingIdentifier = bindingIdentifier;
	}

	public String getOid() {
		return oid;
	}

	public void setOid(String oid) {
		this.oid = oid;
	}

	public String getIntensionalComment() {
		return intensionalComment;
	}

	public void setIntensionalComment(String intensionalComment) {
		this.intensionalComment = intensionalComment;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Stability getStability() {
		return stability;
	}

	public void setStability(Stability stability) {
		this.stability = stability;
	}

	public Extensibility getExtensibility() {
		return extensibility;
	}

	public void setExtensibility(Extensibility extensibility) {
		this.extensibility = extensibility;
	}

	public ContentDefinition getContentDefinition() {
		return contentDefinition;
	}

	public void setContentDefinition(ContentDefinition contentDefinition) {
		this.contentDefinition = contentDefinition;
	}

	public void setNumberOfCodes(int numberOfCodes) {
		this.numberOfCodes = numberOfCodes;
	}

	@Override
	public String getLabel() {
		return this.getBindingIdentifier();
	}

	public SourceType getSourceType() {
		return sourceType;
	}

	public void setSourceType(SourceType sourceType) {
		this.sourceType = sourceType;
	}

	public void setSourceType(String sourceType) {
		this.sourceType = SourceType.valueOf(sourceType);
	}

	@Override
	public Valueset clone() {

		Valueset clone = new Valueset();
		this.complete(clone);
		return clone;
	}

	public void complete(Valueset elm) {
		super.complete(elm);
		elm.bindingIdentifier = bindingIdentifier;
		elm.oid = oid;
		elm.intensionalComment = intensionalComment;
		elm.url = url;
		elm.stability = stability;
		elm.extensibility = extensibility;
		elm.contentDefinition = contentDefinition;
		elm.sourceType = sourceType;
		elm.numberOfCodes = numberOfCodes;
		elm.codeSystems = codeSystems;
		elm.hl7Type = hl7Type;
		elm.includeCodes = includeCodes;
		elm.isFlavor = isFlavor;
		elm.changeLogs = changeLogs;
	}

	public Set<String> getCodeSystems() {
		return codeSystems;
	}

	public void setCodeSystems(Set<String> codeSystems) {
		this.codeSystems = codeSystems;
	}

	public Set<Code> getCodes() {
		return codes;
	}

	public void setCodes(Set<Code> codes) {
		this.codes = codes;
	}

	public String getHl7Type() {
		return hl7Type;
	}

	public void setHl7Type(String hl7Type) {
		this.hl7Type = hl7Type;
	}

	public boolean isFlavor() {
		return isFlavor;
	}

	public void setFlavor(boolean isFlavor) {
		this.isFlavor = isFlavor;
	}

	public boolean contains(String value) {
		for(Code code : this.codes) {
			if(code.getValue().equals(value)) return true;
		}
		return false;
	}

	public List<ChangeReason> getChangeLogs() {
		return changeLogs;
	}

	public void setChangeLogs(List<ChangeReason> changeLogs) {
		this.changeLogs = changeLogs;
	}

	public CodeType getCodeType() {
		return codeType;
	}

	public void setCodeType(CodeType codeType) {
		this.codeType = codeType;
	}

	public Date getSnapshotDate() {
		return snapshotDate;
	}

	public void setSnapshotDate(Date snapshotDate) {
		this.snapshotDate = snapshotDate;
	}

	public CodeSetReference getCodeSetReference() {
		return codeSetReference;
	}

	public void setCodeSetReference(CodeSetReference codeSetReference) {
		this.codeSetReference = codeSetReference;
	};
	
	public CodeSetLinkInfo getCodeSetLink() {
		return codeSetLink;
	}

	public void setCodeSetLink(CodeSetLinkInfo codeSetLink) {
		this.codeSetLink = codeSetLink;
	}

}
