package gov.nist.hit.hl7.igamt.minidump.service.impl;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import gov.nist.hit.hl7.igamt.coconstraints.model.CoConstraintGroup;
import gov.nist.hit.hl7.igamt.common.base.domain.Link;
import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.model.DownloadFile;
import gov.nist.hit.hl7.igamt.common.config.domain.UserConfig;
import gov.nist.hit.hl7.igamt.compositeprofile.domain.CompositeProfileStructure;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatypeLibrary.domain.DatatypeLibrary;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.minidump.service.MiniDumpService;
import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSet;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSetVersion;
import gov.nist.hit.hl7.igamt.valueset.domain.Valueset;
import gov.nist.hit.hl7.igamt.workspace.domain.DocumentLink;
import gov.nist.hit.hl7.igamt.workspace.domain.Folder;
import gov.nist.hit.hl7.igamt.workspace.domain.Workspace;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;
import org.bson.BasicBSONEncoder;
import org.bson.Document;
import com.mongodb.BasicDBObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.bson.types.ObjectId;

@Service
public class MiniDumpServiceImpl implements MiniDumpService {

  private static final String JSON_FOLDER = "json/";
  private static final String BSON_FOLDER = "bson/";
  private static final String JSON_EXTENSION = ".json";
  private static final String BSON_EXTENSION = ".bson";

  private final MongoTemplate mongoTemplate;
  private final ObjectMapper objectMapper;
  private final MappingMongoConverter mongoConverter;
  private final List<UserOwnedCollection> userOwnedCollections;
  private final Map<String, Class<?>> collectionClassMap;

  @Autowired
  public MiniDumpServiceImpl(MongoTemplate mongoTemplate, ObjectMapper objectMapper) {
    this.mongoTemplate = mongoTemplate;
    this.objectMapper = objectMapper;
    this.mongoConverter = (MappingMongoConverter) mongoTemplate.getConverter();
    this.userOwnedCollections = Arrays.asList(
        new UserOwnedCollection(Ig.class, "username"),
        new UserOwnedCollection(DatatypeLibrary.class, "username"),
        new UserOwnedCollection(CodeSet.class, "username"),
        new UserOwnedCollection(Workspace.class, "username"),
        new UserOwnedCollection(ExportConfiguration.class, "username"),
        new UserOwnedCollection(UserConfig.class, "username")
    );
    this.collectionClassMap = buildCollectionClassMap();
  }

  @Override
  public DownloadFile exportUserData(String username, ExportFormat format, String archiveName) {
    String normalizedBaseName = buildArchiveBaseName(username, archiveName);
    MiniDumpArchive archive = new MiniDumpArchive();
    ExportContext exportContext = new ExportContext();

    List<Ig> igs = new ArrayList<>();
    List<DatatypeLibrary> libraries = new ArrayList<>();
    List<Workspace> workspaces = new ArrayList<>();
    List<CodeSet> codeSets = new ArrayList<>();

    for (UserOwnedCollection descriptor : userOwnedCollections) {
      List<?> entities = mongoTemplate.find(Query.query(Criteria.where(descriptor.usernameField()).is(username)), descriptor.type());
      archive.addAll(collectionName(descriptor.type()), entities);
      if (descriptor.type().equals(Ig.class)) {
        igs = castList(entities);
        igs.forEach(ig -> exportContext.processedIgIds.add(ig.getId()));
      } else if (descriptor.type().equals(DatatypeLibrary.class)) {
        libraries = castList(entities);
      } else if (descriptor.type().equals(Workspace.class)) {
        workspaces = castList(entities);
      } else if (descriptor.type().equals(CodeSet.class)) {
        codeSets = castList(entities);
      }
    }

    igs.forEach(ig -> collectIgDependencies(ig, archive));
    libraries.forEach(lib -> collectDatatypeLibraryDependencies(lib, archive));
    workspaces.forEach(ws -> collectWorkspaceDependencies(ws, archive, exportContext));
    codeSets.forEach(cs -> collectCodeSetDependencies(cs, archive));

    try {
      byte[] jsonArchive = null;
      byte[] bsonArchive = null;
      if (format == ExportFormat.BOTH || format == ExportFormat.JSON) {
        jsonArchive = buildJsonArchive(archive);
      }
      if (format == ExportFormat.BOTH || format == ExportFormat.BSON) {
        bsonArchive = buildBsonArchive(archive);
      }

      if (format == ExportFormat.JSON) {
        return new DownloadFile(normalizedBaseName + "-json.zip", "application/zip", new ByteArrayInputStream(jsonArchive));
      }
      if (format == ExportFormat.BSON) {
        return new DownloadFile(normalizedBaseName + "-bson.zip", "application/zip", new ByteArrayInputStream(bsonArchive));
      }

      ByteArrayOutputStream combined = new ByteArrayOutputStream();
      try (ZipOutputStream zipOut = new ZipOutputStream(combined)) {
        if (jsonArchive != null) {
          writeBinaryEntry(zipOut, normalizedBaseName + "-json.zip", jsonArchive);
        }
        if (bsonArchive != null) {
          writeBinaryEntry(zipOut, normalizedBaseName + "-bson.zip", bsonArchive);
        }
      }
      return new DownloadFile(normalizedBaseName + "-mini-dump.zip", "application/zip", new ByteArrayInputStream(combined.toByteArray()));
    } catch (IOException e) {
      throw new IllegalStateException("Unable to export mini dump for user " + username, e);
    }
  }

  @Override
  public void importUserData(String username, InputStream dumpStream, ImportMode mode) {
    Map<String, List<Document>> collected = new HashMap<>();
    boolean foundSupportedEntry = false;

    try (ZipInputStream zipInputStream = new ZipInputStream(dumpStream)) {
      ZipEntry entry;
      while ((entry = zipInputStream.getNextEntry()) != null) {
        if (entry.isDirectory()) { zipInputStream.closeEntry(); continue; }
        if (entry.getName().startsWith(JSON_FOLDER) && entry.getName().endsWith(JSON_EXTENSION)) {
          String collection = extractCollectionName(entry.getName());
          if (collectionClassMap.containsKey(collection)) {
            foundSupportedEntry = true;
            byte[] payload = readAllBytes(zipInputStream);
            collected.put(collection, parseJsonToDocuments(payload));
          }
        }
        zipInputStream.closeEntry();
      }
    } catch (IOException e) {
      throw new IllegalStateException("Unable to import mini dump for user " + username, e);
    }

    if (!foundSupportedEntry) {
      throw new IllegalArgumentException("Archive is missing expected json/ folder with collection files.");
    }

    for (String collection : collectionClassMap.keySet()) {
      List<Document> documents = collected.getOrDefault(collection, Collections.emptyList());
      if (documents.isEmpty()) continue;

      Class<?> type = collectionClassMap.get(collection);
      String collName = mongoTemplate.getCollectionName(type);
      com.mongodb.client.MongoCollection<Document> coll = mongoTemplate.getCollection(collName);

      for (Document doc : documents) {
        doc.put("username", username);
        doc.remove("version");
        // Normalize top-level _id to ObjectId
        if (doc.containsKey("_id")) {
          doc.put("_id", toObjectIdIfValid(doc.get("_id")));
        }
        // Normalize extended JSON values (dates, longs) throughout the document
        normalizeExtendedJsonValues(doc);
      }

      if (mode == ImportMode.OVERRIDE) {
        Set<Object> ids = new HashSet<>();
        for (Document doc : documents) {
          Object id = doc.get("_id");
          if (id != null) ids.add(id);
        }
        if (!ids.isEmpty()) {
          coll.deleteMany(new Document("_id", new Document("$in", new ArrayList<>(ids))));
        }
        coll.insertMany(documents);
      } else {
        // MERGE: only insert docs whose _id does not already exist
        Set<Object> ids = new HashSet<>();
        for (Document doc : documents) {
          Object id = doc.get("_id");
          if (id != null) ids.add(id);
        }
        Set<Object> existingIds = new HashSet<>();
        if (!ids.isEmpty()) {
          coll.find(new Document("_id", new Document("$in", new ArrayList<>(ids))))
              .projection(new Document("_id", 1))
              .forEach((java.util.function.Consumer<Document>) d -> existingIds.add(d.get("_id")));
        }
        List<Document> toInsert = new ArrayList<>();
        for (Document doc : documents) {
          Object id = doc.get("_id");
          if (id == null || !existingIds.contains(id)) {
            toInsert.add(doc);
          }
        }
        if (!toInsert.isEmpty()) {
          coll.insertMany(toInsert);
        }
      }
    }
  }

  /**
   * Parse a JSON byte array (expected to be a JSON array) into a list of BSON Documents.
   * Preserves _class and all fields exactly as exported.
   */
  @SuppressWarnings("unchecked")
  private List<Document> parseJsonToDocuments(byte[] payload) throws IOException {
    List<?> raw = objectMapper.readValue(payload, List.class);
    List<Document> docs = new ArrayList<>(raw.size());
    for (Object item : raw) {
      if (item instanceof Map) {
        docs.add(new Document((Map<String, Object>) item));
      }
    }
    return docs;
  }

  /**
   * Convert a value to ObjectId if it's a valid 24-char hex string.
   */
  private Object toObjectIdIfValid(Object value) {
    if (value instanceof ObjectId) return value;
    if (value instanceof String) {
      String s = ((String) value).trim();
      if (ObjectId.isValid(s)) return new ObjectId(s);
      return s;
    }
    return value;
  }

  /**
   * Recursively walk a Document and convert extended JSON types back to native BSON types:
   * - {"$date": epoch} → java.util.Date
   * - {"$numberLong": "n"} → Long
   * - {"$numberInt": "n"} → Integer
   * - {"$numberDouble": "n"} → Double
   * Does NOT touch _id fields inside nested documents (those are reference strings, not ObjectIds).
   */
  private void normalizeExtendedJsonValues(Document doc) {
    for (String key : new ArrayList<>(doc.keySet())) {
      Object val = doc.get(key);
      Object normalized = normalizeValue(val);
      if (normalized != val) {
        doc.put(key, normalized);
      }
    }
  }

  private Object normalizeValue(Object value) {
    if (value instanceof Map) {
      @SuppressWarnings("unchecked")
      Map<String, Object> map = (Map<String, Object>) value;
      // Check for extended JSON single-key wrappers
      if (map.size() == 1) {
        if (map.containsKey("$date")) {
          Object dv = map.get("$date");
          if (dv instanceof Number) return new Date(((Number) dv).longValue());
          if (dv instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> inner = (Map<String, Object>) dv;
            if (inner.containsKey("$numberLong")) {
              try { return new Date(Long.parseLong(String.valueOf(inner.get("$numberLong")))); } catch (NumberFormatException ignored) {}
            }
          }
          if (dv instanceof String) {
            try { return new Date(Long.parseLong((String) dv)); } catch (NumberFormatException ignored) {}
          }
          return value;
        }
        if (map.containsKey("$numberLong")) {
          try { return Long.parseLong(String.valueOf(map.get("$numberLong"))); } catch (NumberFormatException ignored) {}
        }
        if (map.containsKey("$numberInt")) {
          try { return Integer.parseInt(String.valueOf(map.get("$numberInt"))); } catch (NumberFormatException ignored) {}
        }
        if (map.containsKey("$numberDouble")) {
          try { return Double.parseDouble(String.valueOf(map.get("$numberDouble"))); } catch (NumberFormatException ignored) {}
        }
      }
      // Not an extended JSON wrapper — recurse into sub-document
      Document sub = (value instanceof Document) ? (Document) value : new Document(map);
      normalizeExtendedJsonValues(sub);
      return sub;
    }
    if (value instanceof List) {
      List<?> list = (List<?>) value;
      List<Object> result = new ArrayList<>(list.size());
      for (Object item : list) {
        result.add(normalizeValue(item));
      }
      return result;
    }
    return value;
  }

  private void collectIgDependencies(Ig ig, MiniDumpArchive archive) {
    if (ig == null) {
      return;
    }
    String igId = ig.getId();
    collectRegistryResources(ig.getDatatypeRegistry(), Datatype.class, igId, archive);
    collectRegistryResources(ig.getSegmentRegistry(), Segment.class, igId, archive);
    collectRegistryResources(ig.getConformanceProfileRegistry(), ConformanceProfile.class, igId, archive);
    collectRegistryResources(ig.getProfileComponentRegistry(), ProfileComponent.class, igId, archive);
    collectRegistryResources(ig.getCompositeProfileRegistry(), CompositeProfileStructure.class, igId, archive);
    collectRegistryResources(ig.getValueSetRegistry(), Valueset.class, igId, archive);
    collectRegistryResources(ig.getCoConstraintGroupRegistry(), CoConstraintGroup.class, igId, archive);
  }

  private void collectCodeSetDependencies(CodeSet codeSet, MiniDumpArchive archive) {
    if (codeSet == null) {
      return;
    }
    Set<String> versionIds = codeSet.getCodeSetVersions();
    if (versionIds == null || versionIds.isEmpty()) {
      return;
    }
    List<CodeSetVersion> versions = mongoTemplate.find(Query.query(Criteria.where("_id").in(versionIds)), CodeSetVersion.class);
    archive.addAll(collectionName(CodeSetVersion.class), versions);
  }

  private void collectDatatypeLibraryDependencies(DatatypeLibrary library, MiniDumpArchive archive) {
    if (library == null) {
      return;
    }
    String libId = library.getId();
    collectRegistryResources(library.getDatatypeRegistry(), Datatype.class, libId, archive);
    collectRegistryResources(library.getValueSetRegistry(), Valueset.class, libId, archive);
  }

  private void collectWorkspaceDependencies(Workspace workspace, MiniDumpArchive archive, ExportContext context) {
    if (workspace == null) {
      return;
    }
    Set<String> igIds = new HashSet<>();
    collectDocumentLinks(workspace.getDocuments(), igIds);
    if (workspace.getFolders() != null) {
      for (Folder folder : workspace.getFolders()) {
        collectDocumentLinks(folder != null ? folder.getChildren() : null, igIds);
      }
    }
    for (String igId : igIds) {
      Ig ig = mongoTemplate.findById(igId, Ig.class);
      if (ig != null && Objects.equals(ig.getUsername(), workspace.getUsername())) {
        archive.add(collectionName(Ig.class), ig);
        if (context.processedIgIds.add(ig.getId())) {
          collectIgDependencies(ig, archive);
        }
      }
    }
  }

  private void collectDocumentLinks(Set<DocumentLink> links, Set<String> igIds) {
    if (links == null) {
      return;
    }
    for (DocumentLink link : links) {
      if (link != null && Type.IGDOCUMENT.equals(link.getType()) && link.getId() != null) {
        igIds.add(link.getId());
      }
    }
  }

  private <T> void collectRegistryResources(Registry registry, Class<T> resourceClass, String documentId, MiniDumpArchive archive) {
    if (registry == null || registry.getChildren() == null || registry.getChildren().isEmpty()) {
      return;
    }
    Set<String> ids = new HashSet<>();
    for (Link link : registry.getChildren()) {
      if (link != null && link.getId() != null) {
        ids.add(link.getId());
      }
    }
    if (ids.isEmpty()) {
      return;
    }
    Criteria criteria = Criteria.where("_id").in(ids).and("documentInfo.documentId").is(documentId);
    List<T> resources = mongoTemplate.find(Query.query(criteria), resourceClass);
    archive.addAll(collectionName(resourceClass), resources);
  }

  private void writeDirectoryEntry(ZipOutputStream zipOut, String directory) throws IOException {
    ZipEntry dirEntry = new ZipEntry(directory);
    zipOut.putNextEntry(dirEntry);
    zipOut.closeEntry();
  }

  private byte[] buildJsonArchive(MiniDumpArchive archive) throws IOException {
    ByteArrayOutputStream buffer = new ByteArrayOutputStream();
    try (ZipOutputStream zipOut = new ZipOutputStream(buffer)) {
      writeDirectoryEntry(zipOut, JSON_FOLDER);
      for (String collection : collectionClassMap.keySet()) {
        writeJsonEntry(zipOut, collection, archive.getDocuments(collection));
      }
    }
    return buffer.toByteArray();
  }

  private byte[] buildBsonArchive(MiniDumpArchive archive) throws IOException {
    ByteArrayOutputStream buffer = new ByteArrayOutputStream();
    try (ZipOutputStream zipOut = new ZipOutputStream(buffer)) {
      writeDirectoryEntry(zipOut, BSON_FOLDER);
      for (String collection : collectionClassMap.keySet()) {
        writeBsonEntry(zipOut, collection, archive.getDocuments(collection));
      }
    }
    return buffer.toByteArray();
  }

  private void writeBinaryEntry(ZipOutputStream zipOut, String name, byte[] content) throws IOException {
    ZipEntry entry = new ZipEntry(name);
    zipOut.putNextEntry(entry);
    zipOut.write(content);
    zipOut.closeEntry();
  }

  private void writeJsonEntry(ZipOutputStream zipOut, String collection, List<Document> documents) throws IOException {
    ZipEntry entry = new ZipEntry(JSON_FOLDER + collection + JSON_EXTENSION);
    zipOut.putNextEntry(entry);
    // Convert documents to extended-JSON-safe form so that Date, ObjectId, etc.
    // survive the JSON round-trip without becoming unparseable strings.
    List<Document> jsonSafe = new ArrayList<>(documents.size());
    for (Document doc : documents) {
      jsonSafe.add(toExtendedJsonDocument(doc));
    }
    JsonGenerator generator = objectMapper.getFactory().createGenerator(zipOut);
    generator.disable(JsonGenerator.Feature.AUTO_CLOSE_TARGET);
    generator.writeObject(jsonSafe);
    generator.flush();
    zipOut.closeEntry();
  }

  private void writeBsonEntry(ZipOutputStream zipOut, String collection, List<Document> documents) throws IOException {
    ZipEntry entry = new ZipEntry(BSON_FOLDER + collection + BSON_EXTENSION);
    zipOut.putNextEntry(entry);
    BasicBSONEncoder encoder = new BasicBSONEncoder();
    for (Document doc : documents) {
      zipOut.write(encoder.encode(new BasicDBObject(doc)));
    }
    zipOut.closeEntry();
  }

  /**
   * Converts a Document so that Date, ObjectId, and Long values are written
   * in MongoDB Extended JSON v2 format ({@code {"$date": epoch}},
   * {@code {"$oid": "hex"}}, {@code {"$numberLong": "n"}}).
   * This ensures these types survive a JSON round-trip.
   */
  private Document toExtendedJsonDocument(Document document) {
    Document result = new Document();
    for (Map.Entry<String, Object> entry : document.entrySet()) {
      result.put(entry.getKey(), toExtendedJsonValue(entry.getValue()));
    }
    return result;
  }

  private Object toExtendedJsonValue(Object value) {
    if (value instanceof Date) {
      return new Document("$date", ((Date) value).getTime());
    }
    if (value instanceof ObjectId) {
      // Write ObjectId as a plain hex string for readability.
      // The import loop converts valid hex strings back to ObjectId.
      return ((ObjectId) value).toHexString();
    }
    if (value instanceof Long) {
      return new Document("$numberLong", String.valueOf(value));
    }
    if (value instanceof Document) {
      return toExtendedJsonDocument((Document) value);
    }
    if (value instanceof Map) {
      Document nested = new Document();
      @SuppressWarnings("unchecked")
      Map<String, Object> map = (Map<String, Object>) value;
      for (Map.Entry<String, Object> entry : map.entrySet()) {
        nested.put(entry.getKey(), toExtendedJsonValue(entry.getValue()));
      }
      return nested;
    }
    if (value instanceof List) {
      List<?> list = (List<?>) value;
      List<Object> converted = new ArrayList<>(list.size());
      for (Object item : list) {
        converted.add(toExtendedJsonValue(item));
      }
      return converted;
    }
    return value;
  }


  private Map<String, Class<?>> buildCollectionClassMap() {
    Map<String, Class<?>> map = new LinkedHashMap<>();
    registerCollection(map, Ig.class);
    registerCollection(map, DatatypeLibrary.class);
    registerCollection(map, CodeSet.class);
    registerCollection(map, Workspace.class);
    registerCollection(map, ExportConfiguration.class);
    registerCollection(map, UserConfig.class);
    registerCollection(map, Datatype.class);
    registerCollection(map, Segment.class);
    registerCollection(map, ConformanceProfile.class);
    registerCollection(map, ProfileComponent.class);
    registerCollection(map, CompositeProfileStructure.class);
    registerCollection(map, Valueset.class);
    registerCollection(map, CoConstraintGroup.class);
    registerCollection(map, CodeSetVersion.class);
    return map;
  }

  private void registerCollection(Map<String, Class<?>> map, Class<?> type) {
    map.put(collectionName(type), type);
  }

  private String collectionName(Class<?> type) {
    return mongoTemplate.getCollectionName(type);
  }

  private String extractCollectionName(String entryName) {
    int slashIndex = entryName.indexOf('/');
    if (slashIndex == -1) {
      return "";
    }
    String fileName = entryName.substring(slashIndex + 1);
    int dotIndex = fileName.lastIndexOf('.');
    if (dotIndex == -1) {
      return fileName;
    }
    return fileName.substring(0, dotIndex);
  }

  @SuppressWarnings("unchecked")
  private <T> List<T> castList(List<?> source) {
    return (List<T>) source;
  }


  private static final class UserOwnedCollection {
    private final Class<?> type;
    private final String usernameField;

    private UserOwnedCollection(Class<?> type, String usernameField) {
      this.type = type;
      this.usernameField = usernameField;
    }

    public Class<?> type() {
      return type;
    }

    public String usernameField() {
      return usernameField;
    }
  }

  private static final class ExportContext {
    private final Set<String> processedIgIds = new HashSet<>();
  }

  private final class MiniDumpArchive {
    private final Map<String, List<Document>> documentsByCollection = new HashMap<>();
    private final Map<String, Set<String>> idsByCollection = new HashMap<>();

    void addAll(String collection, List<?> entities) {
      if (entities == null) {
        return;
      }
      for (Object entity : entities) {
        add(collection, entity);
      }
    }

    void add(String collection, Object entity) {
      if (entity == null) {
        return;
      }
      Document document = new Document();
      mongoConverter.write(entity, document);
      // Keep _class — it's needed for polymorphic types (e.g., ComplexDatatype vs PrimitiveDatatype)
      Document sanitized = sanitizeDocument(document);
      String id = extractId(sanitized);
      if (id != null) {
        if (!idsByCollection.computeIfAbsent(collection, key -> new HashSet<>()).add(id)) {
          return;
        }
      }
      documentsByCollection.computeIfAbsent(collection, key -> new ArrayList<>()).add(sanitized);
    }

    List<Document> getDocuments(String collection) {
      return documentsByCollection.getOrDefault(collection, Collections.emptyList());
    }

    private String extractId(Document document) {
      Object rawId = document.get("_id");
      return rawId != null ? rawId.toString() : null;
    }
  }

  private Document sanitizeDocument(Document document) {
    // Top-level: normalize _id to ObjectId for the root document
    Document sanitized = sanitizeDocumentInner(document);
    if (sanitized.containsKey("_id")) {
      sanitized.put("_id", normalizeId(sanitized.get("_id")));
    }
    return sanitized;
  }

  /**
   * Recursively sanitize a document WITHOUT touching _id.
   * Used for nested sub-documents where _id fields are reference IDs
   * that must remain as plain strings.
   */
  private Document sanitizeDocumentInner(Document document) {
    Document sanitized = new Document();
    for (Map.Entry<String, Object> entry : document.entrySet()) {
      sanitized.put(entry.getKey(), sanitizeValue(entry.getValue()));
    }
    return sanitized;
  }

  /**
   * Normalize _id to a proper type: keep ObjectId as ObjectId, convert
   * extended-JSON representations like {"$oid":"hex"} back to ObjectId,
   * and keep plain strings as-is (for collections that use string IDs).
   */
  private Object normalizeId(Object raw) {
    if (raw == null) {
      return null;
    }
    // Already an ObjectId — keep it
    if (raw instanceof ObjectId) {
      return raw;
    }
    // Plain string — if it's a valid ObjectId hex, convert back to ObjectId
    if (raw instanceof String) {
      String text = ((String) raw).trim();
      if (ObjectId.isValid(text)) {
        return new ObjectId(text);
      }
      return text;
    }
    // Extended JSON: {"$oid": "hex"}
    if (raw instanceof Document) {
      Document doc = (Document) raw;
      if (doc.size() == 1 && doc.containsKey("$oid")) {
        Object oid = doc.get("$oid");
        if (oid instanceof String && ObjectId.isValid((String) oid)) {
          return new ObjectId((String) oid);
        }
      }
    }
    if (raw instanceof Map) {
      @SuppressWarnings("unchecked")
      Map<String, Object> map = (Map<String, Object>) raw;
      if (map.size() == 1 && map.containsKey("$oid")) {
        Object oid = map.get("$oid");
        if (oid instanceof String && ObjectId.isValid((String) oid)) {
          return new ObjectId((String) oid);
        }
      }
    }
    return raw;
  }

  private Object sanitizeValue(Object value) {
    if (value instanceof ObjectId) {
      return value;
    }
    if (value instanceof Document) {
      return sanitizeDocumentInner((Document) value);
    }
    if (value instanceof Map) {
      Document nested = new Document();
      @SuppressWarnings("unchecked")
      Map<String, Object> map = (Map<String, Object>) value;
      for (Map.Entry<String, Object> entry : map.entrySet()) {
        if (entry.getKey() != null) {
          nested.put(entry.getKey(), sanitizeValue(entry.getValue()));
        }
      }
      return nested;
    }
    if (value instanceof List) {
      List<?> list = (List<?>) value;
      List<Object> sanitizedList = new ArrayList<>(list.size());
      for (Object item : list) {
        sanitizedList.add(sanitizeValue(item));
      }
      return sanitizedList;
    }
    return value;
  }



  private byte[] readAllBytes(InputStream inputStream) throws IOException {
    ByteArrayOutputStream buffer = new ByteArrayOutputStream();
    byte[] data = new byte[4096];
    int n;
    while ((n = inputStream.read(data, 0, data.length)) != -1) {
      buffer.write(data, 0, n);
    }
    return buffer.toByteArray();
  }


  private String buildArchiveBaseName(String username, String archiveName) {
    String raw = (archiveName != null && !archiveName.trim().isEmpty()) ? archiveName.trim() : username;
    String sanitized = raw.replaceAll("[^a-zA-Z0-9-_]+", "-").replaceAll("-+", "-").replaceAll("^-|-$", "");
    if (sanitized.isEmpty()) {
      sanitized = username;
    }
    String dateSuffix = new SimpleDateFormat("yyyyMMdd").format(new Date());
    return sanitized + "-" + dateSuffix;
  }
}
