package gov.nist.hit.hl7.igamt.export.configuration.newModel;

import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.export.configuration.domain.CodeUsageConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.UsageConfiguration;

public class ExportTools {

	public static Boolean CheckUsage(UsageConfiguration usageConfiguration, Usage usage) {
		return usageConfiguration.isC() && usage.equals(Usage.C) ||
				usageConfiguration.isO() && usage.equals(Usage.O) ||
				usageConfiguration.isCab() && usage.equals(Usage.CAB) ||
				usageConfiguration.isR() && usage.equals(Usage.R) ||
				usageConfiguration.isRe() && usage.equals(Usage.RE) ||
				usageConfiguration.isX() && usage.equals(Usage.X);
	}
	
//	public static Boolean CheckUsageForValueSets(CodeUsageConfiguration usageConfiguration, CodeUsage usage) {
//		return usageConfiguration.isC() && usage.equals(Usage.C) ||
//				usageConfiguration.isO() && usage.equals(Usage.O) ||
//				usageConfiguration.isR() && usage.equals(Usage.R) ||
//				usageConfiguration.isRe() && usage.equals(Usage.RE) ||
//				usageConfiguration.isX() && usage.equals(Usage.X);
//	}
}
