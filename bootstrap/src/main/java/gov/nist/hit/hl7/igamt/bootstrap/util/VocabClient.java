package gov.nist.hit.hl7.igamt.bootstrap.util;


import java.net.MalformedURLException;
import java.net.UnknownHostException;
import java.util.Calendar;
import java.util.HashSet;
import java.util.List;

import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.caucho.hessian.client.HessianProxyFactory;
import com.mongodb.MongoClient;

import gov.cdc.vocab.service.VocabService;
import gov.cdc.vocab.service.bean.CodeSystem;
import gov.cdc.vocab.service.bean.ValueSet;
import gov.cdc.vocab.service.bean.ValueSetConcept;
import gov.cdc.vocab.service.bean.ValueSetVersion;
import gov.cdc.vocab.service.dto.input.CodeSystemSearchCriteriaDto;
import gov.cdc.vocab.service.dto.input.ValueSetSearchCriteriaDto;
import gov.cdc.vocab.service.dto.output.ValueSetConceptResultDto;
import gov.cdc.vocab.service.dto.output.ValueSetResultDto;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.valueset.domain.Code;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Constant.SourceType;
import gov.nist.hit.hl7.igamt.valueset.domain.property.ContentDefinition;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Extensibility;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Stability;

/**
 * Test Client - Connects to the VADS Web Service and Unit Tests the Service methods
 * 
 * @author Eady
 */
public class VocabClient {

  /**
   * Client Instance of the Web Service
   */
  private static VocabService service;

  /**
   * Constructs the Client instance of the Web Service
   */
  public VocabClient() {

    String serviceUrl = "https://phinvads.cdc.gov/vocabService/v2";

    HessianProxyFactory factory = new HessianProxyFactory();
    try {
      service = (VocabService) factory.create(VocabService.class, serviceUrl);
    } catch (MalformedURLException e) {
      e.printStackTrace();
    }
  }

  /**
   * Returns the web service client
   */
  public VocabService getService() {
    return this.service;
  }

  /**
   * Unit tests the VADS Web Service.
   * 
   * @param args no arguments are needed.
   * @throws MalformedURLException
   * @throws UnknownHostException
   */
  public static void main(String[] args) throws MalformedURLException, UnknownHostException {

    VocabService service;
    MongoOperations mongoOps;

    String serviceUrl = "https://phinvads.cdc.gov/vocabService/v2";

    HessianProxyFactory factory = new HessianProxyFactory();
    try {
      service = (VocabService) factory.create(VocabService.class, serviceUrl);
      mongoOps = new MongoTemplate(new SimpleMongoDbFactory(new MongoClient(), "igamt-hl7"));
      List<ValueSet> vss = service.getAllValueSets().getValueSets();

      for (ValueSet vs : vss) {
        System.out.println(vs.getCode() + "," + vs.getName() + "," + vs.getOid());
      }

      new VocabClient().tableSaveOrUpdate("2.16.840.1.114222.4.11.7830", mongoOps);

    } catch (MalformedURLException e) {
      e.printStackTrace();
    }



    // VocabClient client = new VocabClient();
    //
    // ValueSetSearchCriteriaDto vsSearchCrit = new ValueSetSearchCriteriaDto();
    // vsSearchCrit.setFilterByViews(false);
    // vsSearchCrit.setFilterByGroups(false);
    // vsSearchCrit.setCodeSearch(false);
    // vsSearchCrit.setNameSearch(false);
    // vsSearchCrit.setOidSearch(true);
    // vsSearchCrit.setDefinitionSearch(false);
    // vsSearchCrit.setSearchType(1);
    // vsSearchCrit.setSearchText("2.16.840.1.114222.4.11.7574");
    //
    // ValueSetResultDto vsSearchResult = null;
    //
    // vsSearchResult = service.findValueSets(vsSearchCrit, 1, 5);
    // List<ValueSet> valueSets = vsSearchResult.getValueSets();
    //
    // for(ValueSet vs :valueSets ){
    // System.out.println(vs);
    // vs = valueSets.get(0);
    // ValueSetVersion vsv =
    // service.getValueSetVersionsByValueSetOid(vs.getOid()).getValueSetVersions()
    // .get(0);
    //
    // ValueSetConceptResultDto vscByVSVid =
    // service.getValueSetConceptsByValueSetVersionId(vsv.getId(), 1, 100000);
    // List<ValueSetConcept> valueSetConcepts = vscByVSVid.getValueSetConcepts();
    //
    // for (ValueSetConcept pcode : valueSetConcepts) {
    // System.out.println(pcode.getCodeSystemConceptName());
    // System.out.println(pcode.getConceptCode());
    // }
    // }

  }

  private static String getElapsedMiliSeconds(Calendar cal1, Calendar cal2) {
    long cal1Time = cal1.getTimeInMillis();
    long cal2Time = cal2.getTimeInMillis();
    long diffTime = cal2Time - cal1Time;
    return "" + diffTime;
  }


  public Valueset tableSaveOrUpdate(String oid, MongoOperations mongoOps) {
    // 1. Get metadata from PHINVADS web service
    System.out.println("Get metadata from PHINVADS web service for " + oid);

    ValueSetSearchCriteriaDto vsSearchCrit = new ValueSetSearchCriteriaDto();
    vsSearchCrit.setFilterByViews(false);
    vsSearchCrit.setFilterByGroups(false);
    vsSearchCrit.setCodeSearch(false);
    vsSearchCrit.setNameSearch(false);
    vsSearchCrit.setOidSearch(true);
    vsSearchCrit.setDefinitionSearch(false);
    vsSearchCrit.setSearchType(1);
    vsSearchCrit.setSearchText(oid);

    ValueSetResultDto vsSearchResult = null;

    vsSearchResult = this.getService().findValueSets(vsSearchCrit, 1, 5);
    List<ValueSet> valueSets = vsSearchResult.getValueSets();

    ValueSet vs = null;
    ValueSetVersion vsv = null;
    if (valueSets != null && valueSets.size() > 0) {
      vs = valueSets.get(0);
      vsv = this.getService().getValueSetVersionsByValueSetOid(vs.getOid()).getValueSetVersions()
          .get(0);
      System.out.println("Successfully got the metadata from PHINVADS web service for " + oid);
      System.out.println(oid + " last updated date is " + vs.getStatusDate().toString());
      System.out.println(oid + " the Version number is " + vsv.getVersionNumber());

    } else {
      System.out.println("Failed to get the metadata from PHINVADS web service for " + oid);
    }

    // 2. Get Table from DB
    System.out.println("Get metadata from DB for " + oid);

    Valueset table = null;
    table = mongoOps.findOne(
        Query.query(Criteria.where("oid").is(oid).and("domainInfo.scope").is("PHINVADS")),
        Valueset.class);

    if (table != null) {
      System.out.println("Successfully got the metadata from DBe for " + oid);
      System.out.println(oid + " last updated date is " + table.getUpdateDate());
      System.out.println(oid + " the Version number is " + table.getVersion());
    } else {
      System.out.println("Failed to get the metadata from DB for " + oid);
    }

    ValueSetConceptResultDto vscByVSVid = null;
    List<ValueSetConcept> valueSetConcepts = null;

    // 3. compare metadata
    boolean needUpdate = false;
    if (vs != null && vsv != null) {
      if (table != null) {
        if (table.getUpdateDate().equals(vs.getStatusDate())
            && table.getDomainInfo().getVersion().equals(vsv.getVersionNumber() + "")) {
          if (table.getCodes().size() == 0 && table.getNumberOfCodes() == 0) {
            vscByVSVid =
                this.getService().getValueSetConceptsByValueSetVersionId(vsv.getId(), 1, 100000);
            valueSetConcepts = vscByVSVid.getValueSetConcepts();
            if (valueSetConcepts.size() != 0) {
              needUpdate = true;
              System.out.println(
                  oid + " Table has no change! however local PHINVADS codes may be missing");
            }
          }
        } else {
          needUpdate = true;
          System.out
              .println(oid + " Table has a change! because different version number and date.");
        }
      } else {
        needUpdate = true;
        System.out.println(oid + " table is new one.");
      }
    } else {
      needUpdate = false;
      System.out.println(oid + " Table has no change! because PHINVADS does not have it.");
    }

    // 4. if updated, get full codes from PHINVADs web service
    if (needUpdate) {
      if (vscByVSVid == null)
        vscByVSVid =
            this.getService().getValueSetConceptsByValueSetVersionId(vsv.getId(), 1, 100000);
      if (valueSetConcepts == null)
        valueSetConcepts = vscByVSVid.getValueSetConcepts();
      if (table == null)
        table = new Valueset();

      DomainInfo domainInfo = new DomainInfo();

      List<ValueSetVersion> vsvByVSOid =
          this.getService().getValueSetVersionsByValueSetOid(vs.getOid()).getValueSetVersions();
      table.setBindingIdentifier(vs.getCode());
      // table.setDescription(vs.getDefinitionText());
      table.setPreDef(vs.getDefinitionText().replaceAll("\u0019s", " "));
      table.setName(vs.getName());
      table.setOid(vs.getOid());
      domainInfo.setVersion("" + vsvByVSOid.get(0).getVersionNumber());
      table.setContentDefinition(ContentDefinition.Extensional);
      table.setExtensibility(Extensibility.Closed);
      domainInfo.setScope(Scope.PHINVADS);
      table.setStability(Stability.Static);
      table.setComment(vsvByVSOid.get(0).getDescription());
      table.setUpdateDate(vs.getStatusDate());
      table.setCodes(new HashSet<Code>());
      table.setNumberOfCodes(valueSetConcepts.size());
      table.setSourceType(SourceType.EXTERNAL);
      table.setDomainInfo(domainInfo);
      HashSet<String> codeSysSet = new HashSet<String>();

      if (valueSetConcepts.size() > 500) {

      } else {
        for (ValueSetConcept pcode : valueSetConcepts) {
          CodeSystemSearchCriteriaDto csSearchCritDto = new CodeSystemSearchCriteriaDto();
          csSearchCritDto.setCodeSearch(false);
          csSearchCritDto.setNameSearch(false);
          csSearchCritDto.setOidSearch(true);
          csSearchCritDto.setDefinitionSearch(false);
          csSearchCritDto.setAssigningAuthoritySearch(false);
          csSearchCritDto.setTable396Search(false);
          csSearchCritDto.setSearchType(1);
          csSearchCritDto.setSearchText(pcode.getCodeSystemOid());
          CodeSystem cs = this.getService().findCodeSystems(csSearchCritDto, 1, 5).getCodeSystems().get(0);
          Code code = new Code();
          code.setValue(pcode.getConceptCode());
          code.setDescription(pcode.getCodeSystemConceptName());
          code.setComments(pcode.getDefinitionText());
          code.setUsage(CodeUsage.P);
          code.setCodeSystem(cs.getHl70396Identifier());
          codeSysSet.add(cs.getHl70396Identifier());
          table.getCodes().add(code);
        }
        table.setCodeSystems(codeSysSet);
      }

      // 5. update Table on DB
      try {
        table = this.fixValueSetDescription(table);
        System.out.println("This will be updated!!");
        System.out.println(table);
        mongoOps.save(table);
        // for (IGDocument ig : this.igDocs) {
        // if (ig.getProfile().getTableLibrary().findOneTableById(table.getId()) != null) {
        // Notification item = new Notification();
        // item.setByWhom("CDC");
        // item.setChangedDate(new Date());
        // item.setTargetType(TargetType.Valueset);
        // item.setTargetId(table.getId());
        // Criteria where = Criteria.where("igDocumentId").is(ig.getId());
        // Query qry = Query.query(where);
        // Notifications notifications = mongoOps.findOne(qry, Notifications.class);
        // if (notifications == null) {
        // notifications = new Notifications();
        // notifications.setIgDocumentId(ig.getId());
        // notifications.addItem(item);
        // }
        // mongoOps.save(notifications);
        // notificationEmail(notifications.getId());
        // }
        // }
      } catch (Exception e) {
        e.printStackTrace();
        return null;
      }
      return table;
    }
    return null;
  }

  private Valueset fixValueSetDescription(Valueset t) {
    String description = t.getDescription();
    if (description == null)
      description = "";
    else {
      description = description.replaceAll("\u0019s", " ");
    }
    String defPostText = t.getPostDef();
    if (defPostText == null)
      defPostText = "";
    else {
      defPostText = defPostText.replaceAll("\u0019s", " ");
      defPostText = defPostText.replaceAll("“", "&quot;");
      defPostText = defPostText.replaceAll("”", "&quot;");
      defPostText = defPostText.replaceAll("\"", "&quot;");
    }
    String defPreText = t.getPreDef();
    if (defPreText == null)
      defPreText = "";
    else {
      defPreText = defPreText.replaceAll("\u0019s", " ");
      defPreText = defPreText.replaceAll("“", "&quot;");
      defPreText = defPreText.replaceAll("”", "&quot;");
      defPreText = defPreText.replaceAll("\"", "&quot;");
    }

    t.setDescription(description);
    t.setPostDef(defPostText);
    t.setPreDef(defPreText);

    return t;
  }

}
