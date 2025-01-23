package gov.nist.hit.hl7.igamt.bootstrap.app;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Properties;
import java.util.Set;
import java.util.StringJoiner;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import gov.nist.hit.hl7.igamt.ig.data.fix.PcConformanceStatementsIdFixes;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import ca.uhn.fhir.context.FhirContext;
//import gov.nist.hit.hl7.igamt.bootstrap.data.CodeFixer;
import gov.nist.hit.hl7.igamt.bootstrap.data.ConfigCreator;
import gov.nist.hit.hl7.igamt.bootstrap.data.ConfigUpdater;
import gov.nist.hit.hl7.igamt.bootstrap.data.ConformanceStatementFixer;
import gov.nist.hit.hl7.igamt.bootstrap.data.ConformanceStatementsStrengthFix;
import gov.nist.hit.hl7.igamt.bootstrap.data.DataFixer;
import gov.nist.hit.hl7.igamt.bootstrap.data.DocumentInfoService;
import gov.nist.hit.hl7.igamt.bootstrap.data.DynamicMappingFixer;
import gov.nist.hit.hl7.igamt.bootstrap.data.FixIGAttribute;
import gov.nist.hit.hl7.igamt.bootstrap.data.IgFixer;
import gov.nist.hit.hl7.igamt.bootstrap.data.SanityChecker;
import gov.nist.hit.hl7.igamt.bootstrap.data.SingleCodeDataFix;
import gov.nist.hit.hl7.igamt.bootstrap.data.TablesFixes;
import gov.nist.hit.hl7.igamt.bootstrap.factory.BindingCollector;
import gov.nist.hit.hl7.igamt.bootstrap.factory.MessageEventFacory;
import gov.nist.hit.hl7.igamt.coconstraints.service.CoConstraintService;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentMetadata;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentType;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.ProfileType;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.StructureElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.exception.ForbiddenOperationException;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.base.wrappers.AddingInfo;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.config.domain.Config;
import gov.nist.hit.hl7.igamt.common.config.domain.ConnectingInfo;
import gov.nist.hit.hl7.igamt.common.config.service.ConfigService;
import gov.nist.hit.hl7.igamt.common.exception.EntityNotFound;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.MessageStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.repository.ConformanceProfileRepository;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.event.MessageEventService;
import gov.nist.hit.hl7.igamt.constraints.repository.ConformanceStatementRepository;
import gov.nist.hit.hl7.igamt.constraints.repository.PredicateRepository;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Component;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.repository.DatatypeLibraryRepository;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeClassificationService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeClassifier;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeLibraryService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.util.EvolutionPropertie;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportFontConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportType;
import gov.nist.hit.hl7.igamt.export.configuration.repository.ExportConfigurationRepository;
import gov.nist.hit.hl7.igamt.export.configuration.service.ExportConfigurationService;
import gov.nist.hit.hl7.igamt.ig.data.fix.CoConstraintsFixes;
import gov.nist.hit.hl7.igamt.ig.data.fix.PathFixes;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.domain.IgTemplate;
import gov.nist.hit.hl7.igamt.ig.exceptions.AddingException;
import gov.nist.hit.hl7.igamt.ig.exceptions.IGUpdateException;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.ig.repository.IgTemplateRepository;
import gov.nist.hit.hl7.igamt.ig.service.AddService;
import gov.nist.hit.hl7.igamt.ig.service.CrudService;
import gov.nist.hit.hl7.igamt.ig.service.IgService;
import gov.nist.hit.hl7.igamt.ig.util.SectionTemplate;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.repository.SegmentRepository;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.service.impl.IgServiceImpl;
import gov.nist.hit.hl7.igamt.service.verification.impl.SimpleResourceBindingVerificationService;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;
import gov.nist.hit.hl7.igamt.valueset.service.ValuesetService;

@SpringBootApplication
//@EnableMongoAuditing
@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class,
		DataSourceTransactionManagerAutoConfiguration.class, HibernateJpaAutoConfiguration.class})
@EnableMongoRepositories("gov.nist.hit.hl7")
@ComponentScan({"gov.nist.hit.hl7", "gov.nist.hit.hl7.auth.util.crypto","gov.nist.hit.hl7.auth.util.service"})
@EnableScheduling
public class BootstrapApplication implements CommandLineRunner {

	private static final String EMAIL_PORT = "email.port";
	private static final String EMAIL_PROTOCOL = "email.protocol";
	private static final String EMAIL_HOST = "email.host";
	private static final String EMAIL_ADMIN = "email.admin";
	private static final String EMAIL_FROM = "email.from";
	private static final String EMAIL_SUBJECT = "email.subject";
	private static final String EMAIL_SMTP_AUTH = "email.smtp.auth";
	private static final String EMAIL_DEBUG = "email.debug";

	public static void main(String[] args) {
		SpringApplication.run(BootstrapApplication.class, args);
	}

	@Autowired
	ConfigService sharedConstantService;
	@Autowired
	IgTemplateRepository igTemplateRepository;
	//
	@Autowired
	DataFixer dataFixer;
	@Autowired
	ConfigUpdater configUpdater;
	@Autowired
	private PathFixes pathFixes;
	@Autowired
	private CoConstraintsFixes coConstraintsFixes;

	@Autowired
	FixIGAttribute fixAttributes;


	@Autowired
	SimpleResourceBindingVerificationService simpleResourceBindingVerificationService;


	@Autowired
	private ExportConfigurationRepository exportConfigurationRepository;

	@Autowired
	MessageEventFacory messageEventFactory;
	@Autowired
	MessageEventService messageEventService;

	@Autowired
	Environment env;

	@Autowired
	private ExportConfigurationService exportConfigurationService;

	@Autowired
	private ConformanceStatementRepository conformanceStatementRepository;


	@Autowired
	DynamicMappingFixer dynamicMappingFixer;


	@Autowired
	DatatypeLibraryService dataypeLibraryService;

	@Autowired
	DatatypeClassifier datatypeClassifier;
	@Autowired
	CoConstraintService ccService;

	@Autowired
	DatatypeService dataypeService;

	@Autowired
	SegmentService segmentService;
	@Autowired
	SegmentRepository segmentRepo;

	@Autowired
	ValuesetService valuesetService;

	@Autowired
	ConformanceProfileService messageService;
	@Autowired
	ConformanceProfileRepository messageRepo;

	@Autowired
	BindingCollector bindingCollector;
	@Autowired
	DatatypeClassificationService datatypeClassificationService;

	@Autowired
	TablesFixes tableFixes;

	@Autowired
	IgFixer igFixer;

	@Autowired
	IgRepository igRepo;

	@Autowired
	IgService igService;

	@Autowired
	ConformanceStatementFixer conformanceStatementFixer;

	@Autowired
	PcConformanceStatementsIdFixes pcConformanceStatementsIdFixes;

//	@Autowired
//	CodeFixer codeFixer;
	@Autowired
	DocumentInfoService documentService;

	@Autowired
	SanityChecker sanityChecker;

	@Autowired
	SingleCodeDataFix singleCodeDataFix;

	@Autowired
	ConformanceStatementsStrengthFix conformanceStatementsStrengthFix;
	@Autowired
	ConfigCreator configCreator;

	@Autowired
	AddService addingService;
	private Object StructureElementBinding;

	@Autowired
	DatatypeLibraryRepository datatypeLibraryRepository;


	@Bean
	public JavaMailSenderImpl mailSender() {
		JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
		mailSender.setHost(env.getProperty(EMAIL_HOST));
		mailSender.setPort(Integer.valueOf(env.getProperty(EMAIL_PORT)));
		mailSender.setProtocol(env.getProperty(EMAIL_PROTOCOL));
		Properties javaMailProperties = new Properties();
		//    javaMailProperties.setProperty("email.smtp.auth", env.getProperty(EMAIL_SMTP_AUTH));
		//    javaMailProperties.setProperty("mail.debug", env.getProperty(EMAIL_DEBUG));

		mailSender.setJavaMailProperties(javaMailProperties);
		return mailSender;
	}

	@Bean
	public org.springframework.mail.SimpleMailMessage templateMessage() {
		org.springframework.mail.SimpleMailMessage templateMessage =
				new org.springframework.mail.SimpleMailMessage();
		templateMessage.setFrom(env.getProperty(EMAIL_FROM));
		templateMessage.setSubject(env.getProperty(EMAIL_SUBJECT));
		return templateMessage;
	}

	@Bean()
	public FhirContext fhirR4Context() {
		return FhirContext.forR4();
	}


	//
	//   @Bean(name = "multipartResolver")
	//   public CommonsMultipartResolver multipartResolver() {
	//   CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
	//   return multipartResolver;
	//   }
	//   
	//   @Bean
	//   public GridFsTemplate gridFsTemplate() throws Exception {
	//       return new GridFsTemplate(mongoDbFactory(), mappingMongoConverter());
	//   }
	// @Bean
	// public FilterRegistrationBean jwtFilter() {
	// final FilterRegistrationBean registrationBean = new FilterRegistrationBean();Datatype
	// registrationBean.setFilter(new JwtFilter());
	// registrationBean.addUrlPatterns("/api/*");
	//
	// return registrationBean;
	// }


	@Override
	public void run(String... arg0) throws Exception {


	}

	//@PostConstruct
	void fixUsage() throws ValidationException, ForbiddenOperationException{
		List<Segment> segments = this.segmentService.findAll();
		for(Segment s : segments) {
			if(checkAndSetUsages(s.getChildren())) {
				segmentService.save(s);
			}


		}

		List<Datatype> datatypes = this.dataypeService.findAll();
		for(Datatype dataype : datatypes) {
			if(dataype instanceof ComplexDatatype) {
				if(this.checkAndSetUsages(((ComplexDatatype) dataype).getComponents())) {
					this.dataypeService.save(dataype);
				}
			}
		}
	}


	//@PostConstruct
	void fixPaths() {
		this.pathFixes.fix();
	}




	/**
	 * @param set
	 * @return
	 */
	private <T extends StructureElement > boolean checkAndSetUsages(Set<T> set) {
		// TODO Auto-generated method stub
		boolean ret = false;
		for(StructureElement el: set) {
			if(el.getUsage() == null) {
				el.setUsage(Usage.O);
				ret=true;
			}
		}
		return ret;
	}


	/**
	 * @param s
	 * @throws ValidationException 
	 * @throws ForbiddenOperationException 
	 */


	//@PostConstruct
 	void generateDefaultExportConfig() {
		exportConfigurationRepository.deleteByType(ExportType.IGDOCUMENT);
		ExportConfiguration basicExportConfiguration = ExportConfiguration.getBasicExportConfiguration(false, ExportType.IGDOCUMENT);
		basicExportConfiguration.setConfigName("IG Document Default Export Configuration");
		basicExportConfiguration.setOriginal(true);
		basicExportConfiguration.setId("IG-DEFAULT-CONFIG-ID");
		basicExportConfiguration.setDefaultType(false);
		basicExportConfiguration.setDefaultConfig(false);
		exportConfigurationRepository.save(basicExportConfiguration);

	}


	//@PostConstruct
	void generateDiffrentialExportConfig() {
		exportConfigurationRepository.deleteByType(ExportType.DIFFERENTIAL);
		ExportConfiguration basicExportConfiguration = ExportConfiguration.getBasicExportConfiguration(true, ExportType.DIFFERENTIAL);
		basicExportConfiguration.setConfigName("Differential Export Configuration");
		basicExportConfiguration.setOriginal(true);
		basicExportConfiguration.setId("DIFF-DEFAULT-CONFIG-ID");
		basicExportConfiguration.setDefaultType(false);
		basicExportConfiguration.setDefaultConfig(false);
		exportConfigurationRepository.save(basicExportConfiguration);

	}

	//  @PostConstruct
	void generateDTLConfig() {
		exportConfigurationRepository.deleteByType(ExportType.DATATYPELIBRARY);
		ExportConfiguration basicExportConfiguration = ExportConfiguration.getBasicExportConfiguration(true, ExportType.DATATYPELIBRARY);
		basicExportConfiguration.setConfigName("Datatype Library Default Export Configuration");
		basicExportConfiguration.setOriginal(true);
		basicExportConfiguration.setId("DTL-DEFAULT-CONFIG-ID");
		basicExportConfiguration.setDefaultType(false);
		basicExportConfiguration.setDefaultConfig(false);
		exportConfigurationRepository.save(basicExportConfiguration);

	}

	//@PostConstruct
//	void classifyDatatypes() throws DatatypeNotFoundException {
//		datatypeClassificationService.deleteAll();
//		System.out.println("Classifying dts");
//		List<String> hl7Versions = sharedConstantService.findOne().getHl7Versions();
//		HashMap<EvolutionPropertie, Boolean> criterias1 = new HashMap<EvolutionPropertie, Boolean>();
//		criterias1.put(EvolutionPropertie.CPUSAGE, true);
//		criterias1.put(EvolutionPropertie.CPDATATYPE, true);
//		criterias1.put(EvolutionPropertie.CPNUMBER, true);
//		//		criterias1.put(EvolutionPropertie.CPDATATYPENAME, true);
//		datatypeClassifier.classify(hl7Versions,criterias1);
//
//		System.out.println("ENd of Classifying dts");
//
//	}

	//    @PostConstruct
	public void generateBindings() throws FileNotFoundException{
		this.bindingCollector.collect();
	};


	//@PostConstruct
//	public void fixBinding() throws ValidationException, ForbiddenOperationException {
//		this.dataFixer.readCsv();
//	}

	//@PostConstruct
	public void fix0396() throws ValidationException, ForbiddenOperationException{
		tableFixes.fix0396();
	}
	//@PostConstruct
	public void fixPHINValuesets() {
		this.valuesetService.findByDomainInfoScope("PHINVADS").forEach(v -> {
			if(v.getName() == null) {
				v.setName(v.getBindingIdentifier());
			}
			if(v.getCodes() != null) {
				v.getCodes().forEach(c -> {
					if(c.getUsage() == null) {
						c.setUsage(CodeUsage.R);
					}
				});
			}
			try {
				this.valuesetService.save(v);
			} catch (ForbiddenOperationException e) {
				e.printStackTrace();
			}
		});
	}

	//@PostConstruct
	private void createIgTemplate() throws JsonParseException, JsonMappingException, IOException {

		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		List<SectionTemplate> sections =
				objectMapper.readValue(IgServiceImpl.class.getResourceAsStream("/IgTemplate.json"),
						new TypeReference<List<SectionTemplate>>() {});
		IgTemplate template = new IgTemplate();
		template.setChildren(sections);
		template.setDomain("Default");
		template.setName("Default");
		this.igTemplateRepository.insert(template);
	}

	//@PostConstruct
	private void fixIGs() throws EntityNotFound, ForbiddenOperationException{
		this.igFixer.fixIgComponents();
	}

	//@PostConstruct
	void fixConformanceStatements() throws IGUpdateException, EntityNotFound, ForbiddenOperationException {
		// this.conformanceStatementFixer.fixConformanceStatmentsId();
		this.igFixer.deriveChildren();
		this.conformanceStatementFixer.lockCfsForDerived();
		this.igFixer.fixIgComponents();

	}

	//@PostConstruct
	void addDynamicMappingInfo() throws ForbiddenOperationException {
		//codeFixer.fixTableHL70125();
		dynamicMappingFixer.processSegments();
	}

	//@PostConstruct
	void fixDeprecated() throws FileNotFoundException {
		//codeFixer.fixFromCSV();
	}

	//@PostConstruct
	void generateDefaultFontConfigForAll(){
		List<ExportConfiguration> allConfigs= exportConfigurationRepository.findAll();
		ExportFontConfiguration fontConfig = ExportFontConfiguration.getDefault();
		for(ExportConfiguration config: allConfigs) {
			config.setExportFontConfiguration(fontConfig);
			exportConfigurationRepository.save(config);
		}
	}

	// @PostConstruct
	void fixIgWithDynamicMapping() throws AddingException, ForbiddenOperationException {
		dynamicMappingFixer.addMissingDatatypesBasedOnDynamicMapping();
	}


	//@PostConstruct
	void fixData() throws ForbiddenOperationException {
		this.dataFixer.fixDatatypeConstraintsLevel();
		this.dataFixer.fixConformanceProfileConstaintsLevel();
	}
	//@PostConstruct
	void shiftBinding() throws ForbiddenOperationException {
		this.dataFixer.shiftAllBinding();
	}
	//@PostConstruct
	void updateSegmentDatatype() throws ForbiddenOperationException {
		this.dataFixer.changeHL7SegmentDatatype("OMC", "9", "ID", "2.8.2");

	}
	// @PostConstruct
	void publishStructures() {
		this.dataFixer.publishStructure("607da0e88b87bc00073b4ba6");
	}

	//@PostConstruct
	void fixStructureIds() throws ForbiddenOperationException {
		this.dataFixer.addStructureIds();
	}
	//@PostConstruct
	void addFixedExt() throws ForbiddenOperationException {
		this.dataFixer.addFixedExt();
	}

	//@PostConstruct
	void addVsLocationException() {
		Config config = this.sharedConstantService.findOne();
		this.configUpdater.updateValueSetLoctaionException(config, "ST","CQ_NIST", Type.DATATYPE, 2, config.getHl7Versions());
		this.sharedConstantService.save(config);
	}

	//@PostConstruct
	void fixCoConstraints() {
		this.coConstraintsFixes.fix();
	}



	//@PostConstruct
	void fixAttributes() throws JsonParseException, JsonMappingException, IOException {
		//this.fixAttributes.createJson();
		this.fixAttributes.updateDates();
	}

	//@PostConstruct
	void fixPcCsIds() throws Exception {
		this.pcConformanceStatementsIdFixes.fix();
	}


	//@PostConstruct
	void addDocumentInfo() throws IGUpdateException {
		List<Ig> igs = this.igService.findAll();
		for( Ig ig: igs ) {
			DocumentInfo info = new DocumentInfo(ig.getId(), DocumentType.IGDOCUMENT);
			igService.updateChildrenAttribute(ig, "documentInfo", info, false);
		}
	}


	//IGID:5f7cc40f9194be0006377914Type:VALUESET,ResourceID:626c07988b87bc0007dd0dec
	//IGID:5f7cc40f9194be0006377914Type:VALUESET,ResourceID:626c07a78b87bc0007dd0dff
	//IGID:62961b5c8b87bc0006692096Type:DATATYPE,ResourceID:HL7AD-V2-7
	//@PostConstruct
	void fixDomainInfoForLinks() {

		this.igFixer.fixDatatypeLinksDomainInfo("62961b5c8b87bc0006692096");
		//		this.igFixer.fixValuesetLinksDomainInfo("5f7cc40f9194be0006377914");
		//		this.igFixer.fixCoConstraintEmptyLink("5ef0e7dc2af19b00069cfb2b");
		//		this.igFixer.fixCoConstraintEmptyLink("5ef0e80c2af19b00069d2185");

	}


	//@PostConstruct
	void checkDocumentInfo() throws IGUpdateException {
		List<Ig> igs = this.igService.findAll();
		for( Ig ig: igs ) {
			sanityChecker.checkBrokenLinks(ig); 
			//BROKEN  CCG LINK5ef0e80c2af19b00069d2185
			//BROKEN  CCG LINK5ef0e7dc2af19b00069cfb2b

			//this.documentService.processIgConformanceProfile(ig);
			//sanityChecker.checkUnfoundLinkReferences(ig);
			//sanityChecker.checkWrongDomainInfo(ig);
			//sanityChecker.checkNullDocumentInfo(ig);
			//sanityChecker.checkWrongDocumentInfo(ig);
			//sanityChecker.checkMissingOrigin(ig);

		}
	}

	//@PostConstruct
	void checkCustomStructures() {
		this.sanityChecker.checkCustomStructures();
	}

	//@PostConstruct
	void fixConformanceStatement() {
		conformanceStatementsStrengthFix.fix();
	}
	//@PostConstruct
	void fixSingleCode() throws Exception {
		singleCodeDataFix.check();
	}



	//@PostConstruct
	void ConfigCreateAndUpdate() {
		System.out.println("UPDATE CONFIG");
		configCreator.createSharedConstant();
		Config config = this.sharedConstantService.findOne();
		this.configUpdater.updateValueSetLoctaionException(config, "ST","CQ_NIST", Type.DATATYPE, 2, config.getHl7Versions());
		this.sharedConstantService.save(config);
	}

	//@PostConstruct
	void addVersionFixes() throws ForbiddenOperationException, ValidationException {
		//codeFixer.fixTableHL70125("2.9");
		this.dynamicMappingFixer.processSegmentByVersion("2.9");
		tableFixes.fix0396ByVersion("2.9");


	}

	//@PostConstruct
	void deprecate() throws ForbiddenOperationException, ValidationException {


		igFixer.deprecateIG("5e62985a08bb3a000648c146", Boolean.TRUE);

		igFixer.deprecateIG("5ef10cab2af19b00069efb1d", Boolean.TRUE);

		igFixer.deprecateIG("5f1ef9552af19b00065f7dd4", Boolean.TRUE);

		igFixer.deprecateIG("5f6dfb0a9194be0006d226f5", Boolean.TRUE);

		igFixer.deprecateIG("5f71f7e19194be0006175399", Boolean.TRUE);

		igFixer.deprecateIG("5f809aee9194be0006437932", Boolean.TRUE);

		igFixer.deprecateIG("5fbbcf4d9194be0006abd025", Boolean.TRUE);

		igFixer.deprecateIG("6065f77a8b87bc00073091aa", Boolean.TRUE);

		igFixer.deprecateIG("630644c88b87bc00075490f9", Boolean.TRUE);

	}

	//@PostConstruct
	void addMissing() throws ForbiddenOperationException, ValidationException {
		List<Ig> igs = this.igService.findAll();
		for( Ig ig: igs) {
			igFixer.checkMessing(ig);
		}
	}

	//@PostConstruct
	void checkBinding() throws ForbiddenOperationException, ValidationException {

		igFixer.checkBindingLocation();

	}
	//	@PostConstruct
	void createHL7IG() throws JsonParseException, JsonMappingException, FileNotFoundException, IOException, EntityNotFound, ForbiddenOperationException {


		Config config = this.sharedConstantService.findOne();

		for (String version : config.getHl7Versions() ) {
			//		String version = "2.9";
			Ig ig = this.igService.createEmptyIg();

			List<AddingInfo>  info = createAddingInfo(version);

			ig.setUsername("wakili");
			DomainInfo domainInfo = new DomainInfo();
			domainInfo.setScope(Scope.USER);


			ig.setDomainInfo(domainInfo);
			ig.setMetadata(new DocumentMetadata());
			ig.getMetadata().setTitle("ALL" + version);
			ig.setId(new ObjectId().toHexString());
			ig.setVersion(null);

			this.addingService.addConformanceProfiles(ig, info, "wakili");

			igService.save(ig);
		}

	}

	private List<AddingInfo> createAddingInfo(String s) {
		List<AddingInfo> list = new ArrayList<AddingInfo>();
		this.messageService.findByDomainInfoScopeAndDomainInfoVersion(Scope.HL7STANDARD.toString(), s);
		List<MessageStructure>  structures = messageEventService.findStructureByScopeAndVersion(s, Scope.HL7STANDARD, "wakili");

		for(MessageStructure structure: structures) {
			AddingInfo info = new  AddingInfo();
			info.setDescription(structure.getDescription());
			info.setDomainInfo(new DomainInfo(s, Scope.HL7STANDARD));
			info.setId(new ObjectId().toString());
			info.setOriginalId(structure.getId());
			info.setExt(structure.getStructID());
			info.setName(structure.getEvents().get(0).getName());
			info.setFlavor(true);
			list.add(info);
		}

		return list;
	}

	//@PostConstruct
	void checkUsage() {

		Config config = this.sharedConstantService.findOne();
		System.out.println("Segment,Version,Field,MinCard,MaxCard");

		for (String v: config.getHl7Versions()) {

			List<Segment> segments = this.segmentService.findByDomainInfoScopeAndDomainInfoVersion(Scope.HL7STANDARD.toString(), v);
			for(Segment s: segments) {

				for (Field f: s.getChildren()) {

					if(f.getUsage().equals(Usage.X)) {

						if(f.getMin() !=0 || !f.getMax().equals("0") ) {
							String delimiter = ",";
							StringJoiner joiner = new StringJoiner(delimiter);
							joiner.add(s.getName());
							joiner.add(s.getDomainInfo().getVersion());
							joiner.add(f.getId());
							joiner.add(String.valueOf(f.getMin()));
							joiner.add(f.getMax());
							System.out.println(joiner.toString());

						}
					}	
				}

			}

		}

	}
	//////////////////////
	//@PostConstruct

	//@PostConstruct
	void fixSegmentduplicatedBinding() throws ValidationException, ForbiddenOperationException {
		System.out.println("fixSegmentduplicatedBinding");

		tableFixes.removeSegmentsDuplicatedBinding("2.9");
	}
	//@PostConstruct
	void updateConfIg() {
		System.out.println("UPDATE CONFIG");
		configCreator.addTXExceptions();
		configCreator.addNMExceptions();
	}
	//@PostConstruct
	void addDefaultLocation() {
		System.out.println("ADD DEFAULT LOCATION");

		this.dataFixer.addDefaultLocation();

	}
	//@PostConstruct
	void updateUsage(){
		System.out.println("FIX USAGES");

		this.dataFixer.updateUsage(Scope.HL7STANDARD, "2.3.1", "OBR", "5", Usage.X, Usage.B);
		this.dataFixer.updateUsage(Scope.HL7STANDARD, "2.3.1", "OBR", "6", Usage.X, Usage.B);

		this.dataFixer.updateUsage(Scope.HL7STANDARD, "2.7.1", "OBX", "7", Usage.X, Usage.O);

		this.dataFixer.updateUsage(Scope.HL7STANDARD, "2.7.1", "OBX", "9", Usage.X, Usage.O);

		this.dataFixer.updateUsage(Scope.HL7STANDARD, "2.7.1", "OBX", "12", Usage.X, Usage.O);

		this.dataFixer.updateUsage(Scope.HL7STANDARD, "2.7.1", "OBX", "13", Usage.X, Usage.O);

		this.dataFixer.updateUsage(Scope.HL7STANDARD, "2.7.1", "OBX", "14", Usage.X, Usage.O);

		this.dataFixer.updateUsage(Scope.HL7STANDARD, "2.7.1", "OBX", "15", Usage.X, Usage.O);



	}

	//@PostConstruct
	void updateSCV(){
		System.out.println("FIX SCV");

		this.dataFixer.updateSCVDatatype();
	}
	//@PostConstruct
	void updateRCD(){
		System.out.println("FIX RCD");

		this.dataFixer.updateRCD();
	}

	//@PostConstruct
	void shiftBindingV2_9() throws ForbiddenOperationException {
		System.out.println("SHIFT BINDING");

		this.dataFixer.shiftBindingV2_9();

	}
	//@PostConstruct
	void removeBindings() {
		System.out.println("RMOVE BINDING");

		this.dataFixer.removeBindingsV2_9();
	}

	//@PostConstruct
//	void setWithDrawn() throws DatatypeNotFoundException {
//		this.dataFixer.setWithdrawnV2_9();
//		this.datatypeLibraryRepository.deleteAll();
//		this.classifyDatatypes();
//	}

	//@PostConstruct
	void setProfileType() {
		List<ConformanceProfile> profiles= this.messageRepo.findAll();
		
		for(ConformanceProfile p: profiles) {
			if(p.getProfileType().equals(ProfileType.HL7)) {
				p.setProfileType(ProfileType.Constrainable);
				System.out.println("changed[ "+p.getId()+"ProfileType");
				messageRepo.save(p);

			}
		}
	}


	//@PostConstruct
//	void FindSecondLevelBinding() throws Exception{
//		System.out.println("FIND SECOND LEVEL BINDING");
//			this.dataFixer.findSecondLevelBinding();
//
//	}


	

}
