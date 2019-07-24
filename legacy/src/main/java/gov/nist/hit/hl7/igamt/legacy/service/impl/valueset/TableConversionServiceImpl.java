package gov.nist.hit.hl7.igamt.legacy.service.impl.valueset;

import java.util.Date;
import java.util.HashSet;
import java.util.List;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Table;
import gov.nist.hit.hl7.auth.domain.Account;
import gov.nist.hit.hl7.auth.repository.AccountRepository;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.legacy.repository.TableRepository;
import gov.nist.hit.hl7.igamt.legacy.service.ConversionService;
import gov.nist.hit.hl7.igamt.legacy.service.util.ConversionUtil;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Constant.SourceType;
import gov.nist.hit.hl7.igamt.valueset.domain.property.ContentDefinition;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Extensibility;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Stability;
import gov.nist.hit.hl7.igamt.valueset.repository.ValuesetRepository;

public class TableConversionServiceImpl implements ConversionService {

	private static TableRepository legacyTableRepository = (TableRepository) legacyContext.getBean("tableRepository");
	private static ValuesetRepository valuesetService = context.getBean(ValuesetRepository.class);

	private AccountRepository accountRepository = userContext.getBean(AccountRepository.class);

	@Override
	public void convert() {
		init();
		List<Table> allTables = legacyTableRepository.findAll();
		for (Table t : allTables) {
			this.convertTable(t);
		}
	}

	private void convertTable(Table table) {
		Valueset v = new Valueset();

		v.setBindingIdentifier(table.getBindingIdentifier());
		v.setCreatedFrom(table.getCreatedFrom());
		v.setDescription(table.getDescription());
		v.setComment(table.getComment());
		v.setName(table.getName());
		v.setPostDef(table.getDefPostText());
		v.setPreDef(table.getDefPreText());
		v.setOid(table.getOid());
		v.setUsername(null);
		v.setIntensionalComment(table.getIntensionalComment());
		if (table.getSourceType()
				.equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Constant.SourceType.EXTERNAL))
			v.setSourceType(SourceType.EXTERNAL);
		else if (table.getSourceType()
				.equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Constant.SourceType.INTERNAL))
			v.setSourceType(SourceType.INTERNAL);

		// v.setSourceType(table.getSourceType().value);
		if (table.getContentDefinition()
				.equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ContentDefinition.Extensional)) {
			v.setContentDefinition(ContentDefinition.Extensional);
		} else if (table.getContentDefinition()
				.equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ContentDefinition.Intensional)) {
			v.setContentDefinition(ContentDefinition.Intensional);
		} else {
			v.setContentDefinition(ContentDefinition.Undefined);
		}

		if (table.getExtensibility().equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Extensibility.Closed)) {
			v.setExtensibility(Extensibility.Closed);
		} else if (table.getExtensibility()
				.equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Extensibility.Open)) {
			v.setExtensibility(Extensibility.Open);
		} else {
			v.setExtensibility(Extensibility.Undefined);
		}

		if (table.getStability().equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Stability.Dynamic)) {
			v.setStability(Stability.Dynamic);
		} else if (table.getStability().equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Stability.Static)) {
			v.setStability(Stability.Static);
		} else {
			v.setStability(Stability.Undefined);
		}
		v.setUrl(table.getReferenceUrl());

		DomainInfo info = new DomainInfo();
		info.setScope(ConversionUtil.convertScope(table.getScope()));
		info.setVersion(table.getHl7Version());
		v.setDomainInfo(info);
		HashSet<String> compatibility = new HashSet<String>();
		compatibility.add(table.getHl7Version());
		info.setCompatibilityVersion(compatibility);

		PublicationInfo publicationInfo = new PublicationInfo();
		publicationInfo.setPublicationDate(new Date());
		publicationInfo.setPublicationVersion("" + table.getPublicationVersion());
		v.setPublicationInfo(publicationInfo);

		if (table.getCodes() != null) {
			HashSet<Code> codes = new HashSet<Code>();
			v.setCodes(new HashSet<Code>());
			for (gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Code c : table.getCodes()) {
				codes.add(convertCode(c));
			}
			v.setCodes(codes);
		}
		if (table.getAccountId() != null) {
			Account acc = accountRepository.findByAccountId(table.getAccountId());
			if (acc != null && acc.getAccountId() != null) {
				if (acc.getUsername() != null) {

					v.setUsername(acc.getUsername());
				}
			}
		}
		v.setCodeSystems(table.getCodeSystems());
		v.setId(table.getId());
		if(table.getCodes().isEmpty()) {
			v.setNumberOfCodes(table.getNumberOfCodes());

		}else {
			v.setNumberOfCodes(table.getCodes().size());
		}
		valuesetService.save(v);
		
	}

	private void init() {
		// valuesetService.removeCollection();
		// codeSystemService.removeCollection();
	}

	private Code convertCode(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Code c) {

		Code code = new Code();
		code.setCodeSystem(c.getCodeSystem());
		code.setDescription(c.getLabel());
		code.setValue(c.getValue());
		code.setComments(c.getComments());
		if (c.getCodeUsage().equals("R")) {
			code.setUsage(CodeUsage.R);
		} else if (c.getCodeUsage().equals("E")) {
			code.setUsage(CodeUsage.E);
		} else if (c.getCodeUsage().equals("P")) {
			code.setUsage(CodeUsage.P);
		}
		return code;
	}

}
