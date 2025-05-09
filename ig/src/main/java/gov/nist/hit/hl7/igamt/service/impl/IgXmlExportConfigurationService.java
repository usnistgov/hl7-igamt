package gov.nist.hit.hl7.igamt.service.impl;

import gov.nist.hit.hl7.igamt.ig.domain.ExternalValueSetExportMode;
import gov.nist.hit.hl7.igamt.ig.domain.IgXmlExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.repository.IgXmlExportConfigurationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class IgXmlExportConfigurationService {

	@Autowired
	private IgXmlExportConfigurationRepository igXmlExportConfigurationRepository;

	public IgXmlExportConfiguration getConfiguration(String igId, String username) {
		return igXmlExportConfigurationRepository.findByIgIdAndUsername(igId, username);
	}

	public Map<String, ExternalValueSetExportMode> getExternalValueSetExportModeMap(String igId, String username, String type) {
		IgXmlExportConfiguration configuration = igXmlExportConfigurationRepository.findByIgIdAndUsername(igId, username);
		if(configuration == null) {
			return new HashMap<>();
		}
		return configuration.getExternalValueSetXmlExportMode().getOrDefault(type, new HashMap<>());
	}

	public IgXmlExportConfiguration saveExternalValueSetExportConfiguration(
			String igId,
			String username,
			String type,
			Map<String, ExternalValueSetExportMode> externalValueSetExportModeMap
	) {
		IgXmlExportConfiguration configuration = getConfiguration(igId, username);
		if(configuration != null) {
			configuration.getExternalValueSetXmlExportMode().put(type, externalValueSetExportModeMap);
			return igXmlExportConfigurationRepository.save(configuration);
		} else {
			configuration = new IgXmlExportConfiguration();
			configuration.setIgId(igId);
			configuration.setUsername(username);
			Map<String, Map<String, ExternalValueSetExportMode>> map = new HashMap<>();
			map.put(type, externalValueSetExportModeMap);
			configuration.setExternalValueSetXmlExportMode(map);
			return igXmlExportConfigurationRepository.save(configuration);
		}
	}

}
