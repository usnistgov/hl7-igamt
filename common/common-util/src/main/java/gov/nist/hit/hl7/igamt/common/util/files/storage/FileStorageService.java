package gov.nist.hit.hl7.igamt.common.util.files.storage;

import java.io.InputStream;
import java.util.List;

import org.bson.types.ObjectId;

import com.mongodb.DBObject;

public interface FileStorageService {


  public ObjectId store(InputStream inputStream, String fileName, String contentType,
      DBObject metaData);

  public com.mongodb.client.gridfs.model.GridFSFile findOne(String id);

  public com.mongodb.client.gridfs.model.GridFSFile findOneByFilename(String filename);

  public List findAll();
}
