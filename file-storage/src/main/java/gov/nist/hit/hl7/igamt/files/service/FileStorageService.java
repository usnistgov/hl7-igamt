package gov.nist.hit.hl7.igamt.files.service;

import java.io.InputStream;
import java.util.List;

import org.bson.Document;
import org.bson.types.ObjectId;

import com.mongodb.client.gridfs.model.GridFSFile;

public interface FileStorageService {


  public ObjectId store(InputStream inputStream, String fileName, String contentType,
      Document metaData);

  public com.mongodb.client.gridfs.model.GridFSFile findOne(String id);

  public GridFSFile findOneByFilename(String filename);
  
  public GridFSFile findByIgAndTypeAndId(String s, String igId, String type);
  
  public void delete(String filename);
  
  //public GridFSFile findByMetaData(String filename);


  public List findAll();

public void save(GridFSFile dbFile);
}
