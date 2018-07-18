package gov.nist.hit.hl7.igamt.files.service;

import java.io.InputStream;
import java.util.List;

import org.bson.types.ObjectId;

import com.mongodb.DBObject;
import com.mongodb.client.gridfs.model.GridFSFile;

public interface FileStorageService {


  public ObjectId store(InputStream inputStream, String fileName, String contentType,
      DBObject metaData);

  public com.mongodb.client.gridfs.model.GridFSFile findOne(String id);

  public GridFSFile findOneByFilename(String filename);

  public List findAll();
}
