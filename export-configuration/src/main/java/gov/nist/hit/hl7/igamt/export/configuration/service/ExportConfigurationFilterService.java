package gov.nist.hit.hl7.igamt.export.configuration.service;

import org.springframework.stereotype.Service;

import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.ExportFilterDecision;

@Service("exportConfigurationFilterService")
public interface ExportConfigurationFilterService {

  public ExportFilterDecision getExportFilterConfiguration(String username);

}
