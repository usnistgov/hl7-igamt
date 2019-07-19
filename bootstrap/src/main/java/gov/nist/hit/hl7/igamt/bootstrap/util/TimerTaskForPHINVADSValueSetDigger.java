package gov.nist.hit.hl7.igamt.bootstrap.util;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.TimerTask;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

public class TimerTaskForPHINVADSValueSetDigger extends TimerTask {

  Logger log = LoggerFactory.getLogger(TimerTaskForPHINVADSValueSetDigger.class);
  private VocabService service;
  private MongoOperations mongoOps;
//  private List<Ig> igDocs = null;

  public static void main(String[] args) throws IOException {
    TimerTaskForPHINVADSValueSetDigger tool = new TimerTaskForPHINVADSValueSetDigger();
    tool.run();
  }

  public TimerTaskForPHINVADSValueSetDigger() {

    String serviceUrl = "https://phinvads.cdc.gov/vocabService/v2";

    HessianProxyFactory factory = new HessianProxyFactory();
    try {
      setService((VocabService) factory.create(VocabService.class, serviceUrl));
      mongoOps = new MongoTemplate(new SimpleMongoDbFactory(new MongoClient(), "igamt-hl7"));
    } catch (MalformedURLException e) {
      e.printStackTrace();
    }

  }

  @Override
  public void run() {
//    igDocs = mongoOps.find(Query.query(Criteria.where("domainInfo.scope").is("USER")),
//        Ig.class);
//    log.info("You have " + igDocs.size() + " igDocuemnts. ");

    log.info("PHINVADSValueSetDigger started at " + new Date());

    List<ValueSet> vss = this.service.getAllValueSets().getValueSets();
    log.info(vss.size() + " value sets' info has been found!");
    int count = 0;
    for (ValueSet vs : vss) {
      count++;
      log.info("########" + count + "/" + vss.size() + "########");
      this.tableSaveOrUpdate(vs.getOid());
    }
    log.info("PHINVADSValueSetDigger ended at " + new Date());
  }

  public Valueset tableSaveOrUpdate(String oid) {
    // 1. Get metadata from PHINVADS web service
    log.info("Get metadata from PHINVADS web service for " + oid);

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
      log.info("Successfully got the metadata from PHINVADS web service for " + oid);
      log.info(oid + " last updated date is " + vs.getStatusDate().toString());
      log.info(oid + " the Version number is " + vsv.getVersionNumber());

    } else {
      log.info("Failed to get the metadata from PHINVADS web service for " + oid);
    }

    // 2. Get Table from DB
    log.info("Get metadata from DB for " + oid);

    Valueset table = null;
    table = mongoOps.findOne(
        Query.query(Criteria.where("oid").is(oid).and("domainInfo.scope").is("PHINVADS")),
        Valueset.class);

    if (table != null) {
      log.info("Successfully got the metadata from DBe for " + oid);
      log.info(oid + " last updated date is " + table.getUpdateDate());
      log.info(oid + " the Version number is " + table.getVersion());
    } else {
      log.info("Failed to get the metadata from DB for " + oid);
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
              log.info(oid + " Table has no change! however local PHINVADS codes may be missing");
            }
          }
        } else {
          needUpdate = true;
          log.info(oid + " Table has a change! because different version number and date.");
        }
      } else {
        needUpdate = true;
        log.info(oid + " table is new one.");
      }
    } else {
      needUpdate = false;
      log.info(oid + " Table has no change! because PHINVADS does not have it.");
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
        
        mongoOps.save(table);
//        for (Ig ig : this.igDocs) {
//          if (ig.getValueSetRegistry().findOneTableById(table.getId()) != null) {
//            Notification item = new Notification();
//            item.setByWhom("CDC");
//            item.setChangedDate(new Date());
//            item.setTargetType(TargetType.Valueset);
//            item.setTargetId(table.getId());
//            Criteria where = Criteria.where("igDocumentId").is(ig.getId());
//            Query qry = Query.query(where);
//            Notifications notifications = mongoOps.findOne(qry, Notifications.class);
//            if (notifications == null) {
//              notifications = new Notifications();
//              notifications.setIgDocumentId(ig.getId());
//              notifications.addItem(item);
//            }
//            mongoOps.save(notifications);
//            notificationEmail(notifications.getId());
//          }
//        }
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

//  private static void notificationEmail(String notificationsId) throws IOException {
//    if (notificationsId != null) {
//      String endpoint = System.getProperty("IGAMT_URL");
//      if (endpoint != null) {
//        String encodedNotificationsId = Base64.getEncoder().encodeToString(notificationsId.getBytes());
//        endpoint = endpoint + "/api/notifications/" + encodedNotificationsId + "/sendEmail";
//        
//        URL url = new URL(endpoint);
//        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
//        conn.setRequestMethod("GET");
//        conn.setRequestProperty("Accept", "application/json");
//        if (conn.getResponseCode() != 200) {
//          throw new RuntimeException("Failed : HTTP error code : " + conn.getResponseCode());
//        }
//        conn.disconnect();
//      }
//    }
//  }

  public VocabService getService() {
    return service;
  }

  public void setService(VocabService service) {
    this.service = service;
  }

  public List<Valueset> findAllpreloadedPHINVADSTables() {
    List<Valueset> tables = new ArrayList<Valueset>();
    tables = mongoOps.find(Query.query(Criteria.where("domainInfo.scope").is("PHINVADS")),
        Valueset.class);

    for (Valueset t : tables) {
      t.setCodes(null);
    }
    return tables;
  }

  public List<Valueset> findAllpreloadedPHINVADSTablesBySearch(String searchValue) {
    List<Valueset> tables = new ArrayList<Valueset>();
    tables =
        mongoOps
            .find(
                Query.query(Criteria.where("domainInfo.scope")
                    .is("PHINVADS").and("bindingIdentifier").regex(Pattern
                        .compile(searchValue, Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE))),
                Valueset.class);

    for (Valueset t : tables) {
      t.setCodes(new HashSet<Code>());
    }
    return tables;
  }
}
