package gov.nist.hit.hl7.igamt.datatype.service;

import gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentType;
import gov.nist.hit.hl7.igamt.common.base.service.RequestScopeCache;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.FreeTextConformanceStatement;
import gov.nist.hit.hl7.igamt.datatype.wrappers.DatatypeDependencies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;


import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
public class ConformanceStatementDependencyService {

	@Autowired
	private RequestScopeCache requestScopeCache;

	public void processResource(ResourceBinding bindings, DocumentInfo documentInfo, DatatypeDependencies used) {
		if(bindings != null && bindings.getConformanceStatements() != null) {
			if(documentInfo != null && documentInfo.getType() != null && documentInfo.getType().equals(DocumentType.IGDOCUMENT)) {
				process(
						bindings.getConformanceStatements(),
						used,
						requestScopeCache.getImplementationGuideBindingIdentifierMap(documentInfo.getDocumentId())
				);
			}
		}
	}

	public void process(Set<ConformanceStatement> conformanceStatements, DatatypeDependencies used, Map<String, String> igBindingIdentifiers) {
		Set<String> bindingIdentifiers = getBindingIdentifierReferences(conformanceStatements);
		for(String bindingIdentifier : bindingIdentifiers) {
			if(igBindingIdentifiers.containsKey(bindingIdentifier)) {
				String valueSetId = igBindingIdentifiers.get(bindingIdentifier);
				used.getValuesets().put(valueSetId, true);
			}
		}
	}

	public Set<String> getBindingIdentifierReferences(Set<ConformanceStatement> conformanceStatements) {
		return conformanceStatements.stream().map(this::getBindingIdentifierReferences)
		                            .flatMap(Set::stream)
		                            .collect(java.util.stream.Collectors.toSet());
	}

	public Set<String> getBindingIdentifierReferences(ConformanceStatement conformanceStatement) {
		if(conformanceStatement instanceof FreeTextConformanceStatement) {
			FreeTextConformanceStatement freeTextConformanceStatement = (FreeTextConformanceStatement) conformanceStatement;
			String assertionScript = freeTextConformanceStatement.getAssertionScript();
			if(assertionScript != null && !assertionScript.isEmpty()) {
				try {
					Document assertion = parseAssertion(assertionScript);
					return getBindingIdentifierReferences(assertion);
				} catch (IOException | SAXException | ParserConfigurationException | XPathExpressionException e) {
					return new HashSet<>();
				}
			}
		}
		return new HashSet<>();
	}

	private Set<String> getBindingIdentifierReferences(Document assertion) throws XPathExpressionException {
		Set<String> references = new HashSet<>();
		XPath xPath = XPathFactory.newInstance().newXPath();
		NodeList nodeList = (NodeList) xPath.compile("//ValueSet/@ValueSetID").evaluate(assertion, XPathConstants.NODESET);
		for(int i = 0; i < nodeList.getLength(); i++) {
			Node n = nodeList.item(i);
			references.add(n.getNodeValue());
		}
		return references;
	}

	private Document parseAssertion(String assertion) throws IOException, SAXException, ParserConfigurationException {
		DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = builderFactory.newDocumentBuilder();
		return builder.parse(new ByteArrayInputStream(assertion.getBytes(StandardCharsets.UTF_8)));
	}
}
