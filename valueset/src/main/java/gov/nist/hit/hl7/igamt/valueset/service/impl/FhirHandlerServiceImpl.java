package gov.nist.hit.hl7.igamt.valueset.service.impl;

import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.PostConstruct;

import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLContextBuilder;
import org.apache.http.conn.ssl.TrustAllStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.hl7.fhir.r4.model.Bundle;
import org.hl7.fhir.r4.model.Bundle.BundleEntryComponent;
import org.hl7.fhir.r4.model.Extension;
import org.hl7.fhir.r4.model.IntegerType;
import org.hl7.fhir.r4.model.Type;
import org.hl7.fhir.r4.model.ValueSet;
import org.hl7.fhir.r4.model.ValueSet.ValueSetExpansionComponent;
import org.hl7.fhir.r4.model.ValueSet.ValueSetExpansionContainsComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.parser.IParser;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.service.FhirHandlerService;

@Service("fhirHandlerService")
public class FhirHandlerServiceImpl implements FhirHandlerService {

	RestTemplate restTemplate;
	
	String url = "https://hit-dev.nist.gov:8095/vocabulary-service/";
	//String url = "https://129.6.24.81:8095/vocabulary-service/";


	@Autowired
	FhirContext fhirR4Context;

	@PostConstruct
	@SuppressWarnings("deprecation")
	public void init() {
		try {
			SSLContextBuilder builder = new SSLContextBuilder();
			builder.loadTrustMaterial(null, new TrustAllStrategy());
			SSLConnectionSocketFactory socketFactory = new SSLConnectionSocketFactory(builder.build(),
					SSLConnectionSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);
			CloseableHttpClient httpClient = HttpClients.custom().setSSLSocketFactory(socketFactory)
					.setHostnameVerifier(SSLConnectionSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER).build();
			HttpComponentsClientHttpRequestFactory fct = new HttpComponentsClientHttpRequestFactory(httpClient);
			this.restTemplate = new RestTemplate(fct);
		} catch (KeyManagementException | NoSuchAlgorithmException | KeyStoreException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@Override
	public List<Valueset> getPhinvadsValuesets() {
		List<Valueset> valuesets = new ArrayList<Valueset>();
		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
		HttpEntity<String> entity = new HttpEntity<String>(headers);
		Bundle bundle = new Bundle();
		System.out.println(restTemplate);
		try {
			ResponseEntity<String> response = restTemplate.exchange(
					url+"phinvads/ValueSet", HttpMethod.GET, entity,
					String.class);

			if (response != null) {
				IParser parser = fhirR4Context.newJsonParser();
				bundle = (Bundle) parser.parseResource(response.getBody());
				if (bundle != null) {
					valuesets = convertBundleToValueset(bundle);
				}
			}
		} catch(Exception e) {
			return valuesets;
		}
		return valuesets;
	}

	@Override
	public Set<Code> getValusetCodes(String oid) {
		Set<Code> codes = new HashSet<Code>();
		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
		HttpEntity<String> entity = new HttpEntity<String>(headers);
		System.out.println(restTemplate);
		ResponseEntity<String> response = restTemplate.exchange(
				url+"phinvads/ValueSet/"+oid+"/$expand", HttpMethod.GET, entity,
				String.class);		

		if (response != null) {
			IParser parser = fhirR4Context.newJsonParser();
			org.hl7.fhir.r4.model.ValueSet vs = (org.hl7.fhir.r4.model.ValueSet) parser.parseResource(response.getBody());
			if (vs != null) {
				codes = convertExpansionToCodes(vs.getExpansion());
			}
		}
		return codes;
	}

	public Set<Code> convertExpansionToCodes(ValueSetExpansionComponent expansion) {
		Set<Code> codes = new HashSet<Code>();
		for (ValueSetExpansionContainsComponent contain : expansion.getContains()) {
			String exclude= contain.getExtensionString("exclude");
			if(exclude ==null || !exclude.equals("true")) {
				Code code = new Code();
				code.setValue(contain.getCode());
				code.setCodeSystem(contain.getSystem());
				code.setDescription(contain.getDisplay());
				String regex= contain.getExtensionString("regexRule");
				code.setPattern(regex);
				if(regex !=null) {
					code.setHasPattern(true);
				}else {
					code.setHasPattern(false);
				}
				codes.add(code);
			}
		}
		return codes;
	}

	@Override
	public Set<Code> getValusetCodeForDynamicTable() {
		Set<Code> codes = new HashSet<Code>();
		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
		HttpEntity<String> entity = new HttpEntity<String>(headers);
		System.out.println(restTemplate);
		try {
			ResponseEntity<String> response = restTemplate.exchange(
					url+"hl7/ValueSet/HL70396/$expand", HttpMethod.GET, entity,
					String.class);

			ResponseEntity<String> responseHL7nnn = restTemplate.exchange(
					url+"hl7/ValueSet/HL7nnnn/$expand", HttpMethod.GET, entity,
					String.class);
			if (response != null) {
				IParser parser = fhirR4Context.newJsonParser();
				org.hl7.fhir.r4.model.ValueSet vs = (org.hl7.fhir.r4.model.ValueSet) parser.parseResource(response.getBody());
				if (vs != null) {
					codes = convertExpansionToCodes(vs.getExpansion());
				}
			}
			if (responseHL7nnn != null) {
				IParser parser = fhirR4Context.newJsonParser();
				org.hl7.fhir.r4.model.ValueSet vsHl7nnn = (org.hl7.fhir.r4.model.ValueSet) parser.parseResource(responseHL7nnn.getBody());
				if (vsHl7nnn != null) {
					codes.addAll(convertExpansionToCodes(vsHl7nnn.getExpansion()));
				}
			}
		} catch(Exception e) {
			codes = new HashSet<Code>(); // Temporary fix 

		}

		return codes;
	}

	public List<Valueset> convertBundleToValueset(Bundle bundle) {
		List<Valueset> valuesets = new ArrayList<Valueset>();
		for (BundleEntryComponent entry : bundle.getEntry()) {
			org.hl7.fhir.r4.model.ValueSet fhirVs = (ValueSet) entry.getResource();
			Valueset vs = new Valueset();
			vs.setOid(fhirVs.getIdElement().getIdPart());
			vs.setUrl(fhirVs.getUrl());
			vs.setDescription(fhirVs.getDescription());
			vs.setName(fhirVs.getTitle());
			vs.setBindingIdentifier(fhirVs.getName());
			Extension numberOfCodesExt = fhirVs.getExtension().stream()
					.filter(ext -> ext.getUrl().equals("numberOfCodes")).findFirst().orElse(null);
			String str = numberOfCodesExt.getValueAsPrimitive().getValueAsString();
			int numberOfCodes = 0;
			if (str != null) {
				numberOfCodes = Integer.parseInt(str);
			}
			vs.setNumberOfCodes(numberOfCodes);
			DomainInfo domainInfo = new DomainInfo();
			domainInfo.setScope(Scope.PHINVADS);
			domainInfo.setVersion(fhirVs.getVersion().toString());
			List<String> compatibilityVersion = new ArrayList<String>();
			compatibilityVersion.add(fhirVs.getVersion().toString());
			domainInfo.setCompatibilityVersion(compatibilityVersion);
			vs.setDomainInfo(domainInfo);
			valuesets.add(vs);
		}
		return valuesets;
	}



}
