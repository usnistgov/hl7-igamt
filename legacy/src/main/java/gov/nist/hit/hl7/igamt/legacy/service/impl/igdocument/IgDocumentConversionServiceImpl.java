package gov.nist.hit.hl7.igamt.legacy.service.impl.igdocument;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.CompositeProfiles;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Datatype;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.DatatypeLibrary;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.DatatypeLink;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.IGDocument;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.IGDocumentScope;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Message;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Messages;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Profile;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ProfileComponentLibrary;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.ProfileComponentLink;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Section;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Segment;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.SegmentLibrary;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.SegmentLink;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Table;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.TableLibrary;
import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.TableLink;
import gov.nist.hit.hl7.auth.domain.Account;
import gov.nist.hit.hl7.auth.repository.AccountRepository;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentMetadata;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.registry.CompositeProfileRegistry;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.registry.ConformanceProfileRegistry;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.repository.IgRepository;
import gov.nist.hit.hl7.igamt.legacy.repository.DatatypeRepository;
import gov.nist.hit.hl7.igamt.legacy.repository.IGDocumentRepository;
import gov.nist.hit.hl7.igamt.legacy.repository.MessageRepository;
import gov.nist.hit.hl7.igamt.legacy.repository.SegmentRepository;
import gov.nist.hit.hl7.igamt.legacy.repository.TableRepository;
import gov.nist.hit.hl7.igamt.legacy.service.ConversionService;
import gov.nist.hit.hl7.igamt.legacy.service.util.ConversionUtil;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.registry.ProfileComponentRegistry;
import gov.nist.hit.hl7.igamt.segment.domain.registry.SegmentRegistry;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;



public class IgDocumentConversionServiceImpl implements ConversionService {


  private static IgRepository igService = (IgRepository) context.getBean("igRepository");


  private static IGDocumentRepository legacyRepository =
      (IGDocumentRepository) legacyContext.getBean("igDocumentRepository");

  private static DatatypeRepository datatypeLegacy =
      (DatatypeRepository) legacyContext.getBean("datatypeRepository");

  private static SegmentRepository segmentLegacy =
      (SegmentRepository) legacyContext.getBean("segmentRepository");

  private static MessageRepository messageLegacy =
      (MessageRepository) legacyContext.getBean("messageRepository");

  private static TableRepository tableLegacy =
      (TableRepository) legacyContext.getBean("tableRepository");

  private AccountRepository accountRepository = userContext.getBean(AccountRepository.class);

  public IgDocumentConversionServiceImpl() {
    super();
  }

  @Override
  public void convert() {
    // TODO Auto-generated method stub
    List<IGDocument> igs = legacyRepository.findAll();
    System.out.println(accountRepository.findAll().get(0).getEmail());

    for (IGDocument ig : igs) {
      convert(ig);
    }

  }


  private void convert(IGDocument ig) {



    Ig newIg = new Ig();
    // Metadata
    newIg.setId(ig.getId());
    if (ig.getAccountId() != null) {
      Account acc = accountRepository.findByAccountId(ig.getAccountId());
      if (acc != null) {
        if (acc.getUsername() != null) {

          newIg.setUsername(acc.getUsername());
        }
      }

    }
    DocumentMetadata newMetaData = new DocumentMetadata();
    newMetaData.setIdentifier(ig.getMetaData().getIdentifier());
    newMetaData.setCoverPicture(ig.getMetaData().getCoverPicture());
    newMetaData.setOrgName(ig.getMetaData().getOrgName());
    newMetaData.setTopics(ig.getMetaData().getTopics());
    newMetaData.setSubTitle(ig.getMetaData().getSubTitle());
    newMetaData.setTitle(ig.getMetaData().getTitle());
    newIg.setMetadata(newMetaData);
    newIg.setComment(ig.getComment());
    newIg.setCreatedFrom(ig.getCreatedFrom());
    newIg.setDescription(ig.getMetaData().getDescription());
    DomainInfo domain = new DomainInfo();
    if (ig.getScope().equals(IGDocumentScope.PRELOADED)) {
      domain.setScope(Scope.PRELOADED);
    } else if (ig.getScope().equals(IGDocumentScope.USER)) {
      domain.setScope(Scope.USER);
    } else if (ig.getScope().equals(IGDocumentScope.HL7STANDARD)) {
      domain.setScope(Scope.HL7STANDARD);

    } else if (ig.getScope().equals(IGDocumentScope.ARCHIVED)) {
      domain.setScope(Scope.ARCHIVED);
    }
    newIg.setDomainInfo(domain);
    newIg.setName(ig.getMetaData().getTitle());
    newIg.setUpdateDate(ig.getDateUpdated());
    newIg.setCreationDate(ig.getDateUpdated());
    newIg.setComment(ig.getAuthorNotes());

    if (ig.getChildSections() != null && !ig.getChildSections().isEmpty())
      addNaratives(newIg, ig.getChildSections());
    addProfileTextSections(newIg, ig.getProfile(), ig.getChildSections().size() + 1);

    igService.save(newIg);
  }

  private void addProfileTextSections(Ig newIg, Profile profile, int position) {

    TextSection infra = new TextSection(profile.getId(), profile.getSectionContents(), Type.PROFILE,
        position, "Message Infrastructue");
    TextSection profileComponents = new TextSection(profile.getProfileComponentLibrary().getId(),
        profile.getProfileComponentLibrary().getSectionContents(), Type.PROFILECOMPONENTREGISTRY, 1,
        "Profile Components");
    TextSection conformanceProfiles =
        new TextSection(profile.getMessages().getId(), profile.getMessages().getSectionContents(),
            Type.CONFORMANCEPROFILEREGISTRY, 2, "Conformance Profiles");
    TextSection compositeProfiles = new TextSection(profile.getCompositeProfiles().getId(),
        profile.getCompositeProfiles().getSectionContents(), Type.COMPOSITEPROFILEREGISTRY, 3,
        "Composite Profiles");
    TextSection segments = new TextSection(profile.getSegmentLibrary().getId(),
        profile.getSegmentLibrary().getSectionContents(), Type.SEGMENTREGISTRY, 4,
        "Segments And Fields Description");
    TextSection datatypes = new TextSection(profile.getDatatypeLibrary().getId(),
        profile.getDatatypeLibrary().getSectionContents(), Type.DATATYPEREGISTRY, 5, "Data Types");
    TextSection valueSets = new TextSection(profile.getTableLibrary().getId(),
        profile.getTableLibrary().getSectionContents(), Type.VALUESETREGISTRY, 6, "Value Sets");

    Set<TextSection> children = new HashSet<TextSection>();
    children.add(profileComponents);
    children.add(conformanceProfiles);
    children.add(compositeProfiles);
    children.add(compositeProfiles);
    children.add(segments);
    children.add(datatypes);
    children.add(valueSets);
    infra.setChildren(children);
    newIg.getContent().add(infra);

    newIg.setCompositeProfileRegistry(createCompositeProfiles(profile.getCompositeProfiles()));
    newIg.setProfileComponentRegistry(
        createProfileComponentRegistry(profile.getProfileComponentLibrary()));
    newIg.setConformanceProfileRegistry(createConformanceProfile(profile.getMessages()));
    newIg.setSegmentRegistry(createSegments(profile.getSegmentLibrary()));
    newIg.setDatatypeRegistry(createDatatypes(profile.getDatatypeLibrary()));
    newIg.setValueSetRegistry(createValueSets(profile.getTableLibrary()));

    igService.save(newIg);


  }



  private CompositeProfileRegistry createCompositeProfiles(CompositeProfiles compositeProfiles) {
    CompositeProfileRegistry ret = new CompositeProfileRegistry();
    // List<CompositeProfileStructure> ordred = compositeProfiles
    // .getChildren().stream().sorted((CompositeProfileStructure l1,
    // CompositeProfileStructure l2) -> l1.getName().compareTo(l2.getName()))
    // .collect(Collectors.toList());
    // for (int i = 0; i < ordred.size(); i++) {
    // CompositeKey key = new CompositeKey(ordred.get(i).getId());
    // Link link = new Link(key, i + 1);
    // ret.getChildren().add(link);
    //
    // }
    return ret;
  }



  private ProfileComponentRegistry createProfileComponentRegistry(
      ProfileComponentLibrary profileComponentLibrary) {
    ProfileComponentRegistry ret = new ProfileComponentRegistry();

    List<ProfileComponentLink> ordred = profileComponentLibrary.getChildren().stream().sorted(
        (ProfileComponentLink l1, ProfileComponentLink l2) -> l1.getName().compareTo(l2.getName()))
        .collect(Collectors.toList());
    for (int i = 0; i < ordred.size(); i++) {
      Link link = new Link(ordred.get(i).getId(), i + 1);
      ret.getChildren().add(link);

    }
    return ret;
  }


  Link createLink(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Datatype obj, int position) {
    Link l = new Link();
    l.setId(obj.getId());
    l.setPosition(position);
    l.setDomainInfo(
        new DomainInfo(obj.getHl7Version(), ConversionUtil.convertScope(obj.getScope())));
    return l;
  }

  Link createLink(Message obj, int position) {
    Link l = new Link();
    l.setId(obj.getId());
    l.setPosition(position);
    l.setDomainInfo(
        new DomainInfo(obj.getHl7Version(), ConversionUtil.convertScope(obj.getScope())));
    return l;
  }

  Link createLink(Table obj, int position) {
    Link l = new Link();
    l.setId(obj.getId());
    l.setPosition(position);
    l.setDomainInfo(
        new DomainInfo(obj.getHl7Version(), ConversionUtil.convertScope(obj.getScope())));
    return l;

  }

  Link createLink(Segment obj, int position) {
    Link l = new Link();
    l.setId(obj.getId());
    l.setPosition(position);
    l.setDomainInfo(
        new DomainInfo(obj.getHl7Version(), ConversionUtil.convertScope(obj.getScope())));
    return l;
  }

  private ValueSetRegistry createValueSets(TableLibrary tableLibrary) {
    ValueSetRegistry ret = new ValueSetRegistry();

    List<Table> children = new ArrayList<Table>();

    for (TableLink link : tableLibrary.getChildren()) {
      Table obj = tableLegacy.findDisplayObject(link.getId());
      if (obj != null) {
        children.add(obj);
      }
    }
    List<Table> ordred = children.stream()
        .sorted(
            (Table t1, Table t2) -> t1.getBindingIdentifier().compareTo(t2.getBindingIdentifier()))
        .collect(Collectors.toList());
    for (int i = 0; i < ordred.size(); i++) {
      Link link = this.createLink(ordred.get(i), i + 1);
      ret.getChildren().add(link);

    }
    return ret;
  }

  private DatatypeRegistry createDatatypes(DatatypeLibrary datatypeLibrary) {

    DatatypeRegistry ret = new DatatypeRegistry();
    List<Datatype> children = new ArrayList<Datatype>();

    for (DatatypeLink link : datatypeLibrary.getChildren()) {

      Datatype obj = datatypeLegacy.findDisplayObject(link.getId());
      if (obj != null) {
        children.add(obj);
      }
    }
    List<Datatype> ordred = children.stream()
        .sorted((Datatype t1, Datatype t2) -> t1.getLabel().compareTo(t2.getLabel()))
        .collect(Collectors.toList());
    for (int i = 0; i < ordred.size(); i++) {
      Link link = this.createLink(ordred.get(i), i + 1);
      ret.getChildren().add(link);

    }
    return ret;

  }



  private SegmentRegistry createSegments(SegmentLibrary segmentLibrary) {
    SegmentRegistry ret = new SegmentRegistry();
    List<Segment> children = new ArrayList<Segment>();

    for (SegmentLink link : segmentLibrary.getChildren()) {

      Segment obj = segmentLegacy.findDisplayObject(link.getId());
      if (obj != null) {
        children.add(obj);
      }
    }
    List<Segment> ordred =
        children.stream().sorted((Segment t1, Segment t2) -> t1.getLabel().compareTo(t2.getLabel()))
            .collect(Collectors.toList());
    for (int i = 0; i < ordred.size(); i++) {
      Link link = this.createLink(ordred.get(i), i + 1);
      ret.getChildren().add(link);

    }
    return ret;
  }



  private ConformanceProfileRegistry createConformanceProfile(Messages messages) {
    ConformanceProfileRegistry ret = new ConformanceProfileRegistry();
    for (Message m : messages.getChildren()) {
      Link link = this.createLink(m, m.getPosition());
      ret.getChildren().add(link);

    }
    return ret;
  }

  private void addNaratives(Ig newIg, Set<Section> childSections) {
    // TODO Auto-generated method stub
    Set<gov.nist.hit.hl7.igamt.common.base.domain.TextSection> children =
        new HashSet<TextSection>();
    for (Section s : childSections) {
      children.add(createTextSectionFromSection(s, newIg.getId()));
    }
    newIg.setContent(children);

  }

  private TextSection createTextSectionFromSection(Section s, String parentId) {
    TextSection newSection = new TextSection();
    newSection.setLabel(s.getSectionTitle());
    newSection.setType(Type.TEXT);
    newSection.setDescription(s.getSectionContents());
    newSection.setPosition(s.getSectionPosition());
    newSection.setId(s.getId());
    if (s.getChildSections() != null && !s.getChildSections().isEmpty()) {
      Set<gov.nist.hit.hl7.igamt.common.base.domain.TextSection> children =
          new HashSet<gov.nist.hit.hl7.igamt.common.base.domain.TextSection>();
      for (Section child : s.getChildSections()) {

        children.add(createTextSectionFromSection(child, s.getId()));

      }
      newSection.setChildren(children);

    }
    return newSection;

  }



}
